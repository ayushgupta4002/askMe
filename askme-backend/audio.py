import os
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    google,
    noise_cancellation,
    silero,
)
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from livekit.plugins import sarvam

# from tools import get_slackmsg, get_email, read_email

load_dotenv()

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            vad=silero.VAD.load(),
            stt=sarvam.STT(
                language="hi-IN",
                model="saarika:v2.5",
                api_key=os.getenv("SARVAM_API_KEY"),
            ),
            llm=google.LLM(
                model="gemini-2.0-flash-exp",
                temperature=0.8,
            ),
            tts = google.beta.GeminiTTS(
                model="gemini-2.5-flash-preview-tts",
                voice_name="Zephyr",
                instructions="Speak in a teacher like engaging and professional tone.",
            ),
            # tools=[
            #     get_slackmsg,
            #     get_email,
            #     read_email
            # ],
        )


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            # - For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()

    await session.generate_reply(
        instructions=SESSION_INSTRUCTION
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))