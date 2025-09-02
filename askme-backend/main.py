from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
from mem0 import Memory
import os
import atexit
import signal
import sys
import base64
import mimetypes
import json
import re
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from flask_cors import CORS

# Load env vars
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

config = {
    "llm": {
        "provider": "gemini",
        "config": {
            "model": "gemini-1.5-flash",
            "temperature": 0.2,
            "max_tokens": 2000,
            "top_p": 1.0,
        }
    },
    "vector_store": {
        "provider": "qdrant",
           "config": {
            "path": "C:/Users/ayush/askme_qdrant_v1",  # Fresh path
            "collection_name": "memories",
            "embedding_model_dims": 768
        }

    },
    "embedder": {
        "provider": "gemini",
        "config": {
            "model": "models/text-embedding-004",
        }
    }
}

# Global memory instance
memory = None

def initialize_memory():
    """Initialize memory with error handling"""
    global memory
    try:
        memory = Memory.from_config(config)
        print("Memory initialized successfully")
    except Exception as e:
        print(f"Error initializing memory: {e}")
        # Try with a different path if the first one fails
        config["vector_store"]["config"]["path"] = f"C:/Users/ayush/askme_qdrant_{os.getpid()}"
        try:
            memory = Memory.from_config(config)
            print("Memory initialized with alternative path")
        except Exception as e2:
            print(f"Failed to initialize memory even with alternative path: {e2}")
            sys.exit(1)

def cleanup_memory():
    """Clean up memory resources"""
    global memory
    if memory and hasattr(memory, 'vector_store'):
        try:
            if hasattr(memory.vector_store, 'client'):
                memory.vector_store.client.close()
            print("Memory cleanup completed")
        except Exception as e:
            print(f"Error during cleanup: {e}")

def signal_handler(sig, frame):
    """Handle interrupt signals"""
    print("\nShutting down gracefully...")
    cleanup_memory()
    sys.exit(0)

def load_and_encode_image(img_path):
    """Load image and return base64 encoded data with mime type"""
    try:
        # Get MIME type
        mime_type, _ = mimetypes.guess_type(img_path)
        if not mime_type or not mime_type.startswith('image/'):
            ext = os.path.splitext(img_path)[1].lower()
            mime_map = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }
            mime_type = mime_map.get(ext, 'image/jpeg')

        # Read and encode image
        with open(img_path, "rb") as f:
            image_data = f.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')

        return {
            "type": "image_url",
            "image_url": {
                "url": f"data:{mime_type};base64,{base64_image}"
            }
        }
    except Exception as e:
        print(f"Error processing image {img_path}: {e}")
        return None

def _extract_json_array(text: str):
    """
    Try to parse a JSON array from text. If direct json.loads fails,
    attempt to find the first [...] block and parse that.
    """
    # First try straight parse
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass

    # Regex fallback to the first JSON array
    try:
        match = re.search(r'\[\s*{.*}\s*\]', text, flags=re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except Exception:
        pass

    return None

# Register cleanup functions
atexit.register(cleanup_memory)
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

@app.route("/chat", methods=["POST"])
def chat():
    if memory is None:
        return jsonify({"error": "Memory not initialized"}), 500

    data = request.json or {}
    user_id = str(data.get("userId", ""))
    message = data.get("message")
    images = data.get("images", [])
    stepwise = bool(data.get("stepwise", False))  # NEW: accept stepwise boolean
    context_step = data.get("contextStep")


    if not user_id or not message:
        return jsonify({"error": "userId and message are required"}), 400

    try:
        # Retrieve relevant memories
        relevant_memories = memory.search(query=message, user_id=user_id, limit=3)
        results = relevant_memories.get("results", []) if isinstance(relevant_memories, dict) else []
        memories_str = "\n".join(f"- {entry.get('memory', '')}" for entry in results)
     
        if stepwise:
            system_instr = (
                "You are an intelligent, patient, and knowledgeable teacher who can explain concepts from any field—mathematics, science, politics, history, or general problem-solving. Answer the user's query using the memories and question.\n"
                "Return your answer STRICTLY as a JSON array of step objects (no prose before/after).\n"
                "Each object MUST have: "
                '{"step": <number starting at 1>, "title": "<short title>", "content": "<detailed explanation>"}.\n'
                "Aim for 3–7 steps. Do not include any keys other than step, title, content.\n"
                "Respond ONLY with a valid JSON array."
            )
        else:
            system_instr = (
                "You are an intelligent, patient, and knowledgeable teacher who can explain concepts from any field—mathematics, science, politics, history, or general problem-solving. Answer the question based on the query and the user memories.\n"
            )


        if context_step:
            # If context_step is a list, summarize all steps
            if isinstance(context_step, list):
                steps_summary = "\n".join(
                    f"Step {step.get('step')}: {step.get('title')}\n{step.get('content')}" for step in context_step
                )
                base_text = (
                    f"The user previously received a stepwise breakdown. "
                    f"Now they are asking a follow-up related to these steps:\n\n"
                    f"{steps_summary}\n\n"
                    f"User question: {message}\n\n"
                    f"Answer concisely, focusing only on the provided steps."
                )
            else:
                base_text = (
                    f"The user previously received a stepwise breakdown. "
                    f"Now they are asking a follow-up related to this step:\n\n"
                    f"Step {context_step.get('step')}: {context_step.get('title')}\n"
                    f"{context_step.get('content')}\n\n"
                    f"User question: {message}\n\n"
                    f"Answer concisely, focusing only on this step."
                )
        else:
            base_text = (
                f"{system_instr}\n\n"
                f"User Memories:\n{memories_str if memories_str else '- (none)'}\n\n"
                f"User: {message}"
            )

        # Prepare multimodal content
        message_content = [{"type": "text", "text": base_text}]
        if images and isinstance(images, list):
            for img_name in images:
                img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "storage", img_name))
                if os.path.exists(img_path):
                    image_content = load_and_encode_image(img_path)
                    if image_content:
                        message_content.append(image_content)
                        print(f"Successfully loaded image: {img_name}")
                else:
                    print(f"Image not found: {img_path}")

        # Create HumanMessage with multimodal content
        human_message = HumanMessage(content=message_content)

        # Generate response with Gemini
        response = llm.invoke([human_message])
        assistant_reply = response.content if hasattr(response, "content") else str(response)

        # Prepare output payload
        images_processed = len([
            img for img in images
            if os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "storage", img)))
        ]) if images else 0

        if stepwise:
            steps = _extract_json_array(assistant_reply)
            # Store raw JSON in memory to preserve structure
            memory.add(
                [
                    {"role": "user", "content": f"(stepwise=true) {message}"},
                    {"role": "assistant", "content": assistant_reply},
                ],
                user_id=user_id,
            )

            if steps is not None:
                return jsonify({
                    "userId": user_id,
                    "message": message,
                    "stepwise": True,
                    "steps": steps,
                    "images_processed": images_processed
                })
            else:
                # Fallback if JSON couldn't be parsed
                return jsonify({
                    "userId": user_id,
                    "message": message,
                    "stepwise": True,
                    "steps_raw": assistant_reply,
                    "parse_error": "Failed to parse strict JSON steps; returning raw text.",
                    "images_processed": images_processed
                }), 200

        # Non-stepwise regular response
        memory.add(
            [
                {"role": "user", "content": message},
                {"role": "assistant", "content": assistant_reply},
            ],
            user_id=user_id,
        )

        return jsonify({
            "userId": user_id,
            "message": message,
            "response": assistant_reply,
            "images_processed": images_processed
        })

    except Exception as e:
        return jsonify({"error": f"Chat processing failed: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "memory_initialized": memory is not None,
        "stepwise_supported": True
    })

if __name__ == "__main__":
    # Initialize memory before starting the server
    initialize_memory()

    try:
        app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
    finally:
        cleanup_memory()