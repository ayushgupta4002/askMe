# askMe.in – Doubt-Solving Platform

askMe.in is a full-stack, AI-powered Q&A platform that lets learners quickly clear their doubts through live interaction, text, and audio. It is built with a modern TypeScript/Next.js frontend and a Python backend that orchestrates LLM responses and real-time media. The project is split into two workspaces (`askme-frontend` and `askme-backend`) with a shared `storage` bucket for static assets.

<img width="1886" height="909" alt="Screenshot 2025-09-02 004315" src="https://github.com/user-attachments/assets/886ba199-d903-41d5-af44-48964eb8c9ce" />

<img width="1897" height="841" alt="Screenshot 2025-09-01 190214" src="https://github.com/user-attachments/assets/c1a70a27-b59d-4986-976b-5362eb30be6e" />

Live Voice Based Interaction

<img width="1865" height="880" alt="Screenshot 2025-09-01 190445" src="https://github.com/user-attachments/assets/156b7018-f885-4f43-a2dd-63af0eac831c" />

<img width="1909" height="898" alt="Screenshot 2025-09-01 185410" src="https://github.com/user-attachments/assets/aee4bb3b-87ee-4e48-a87f-526021d38d59" />

---

## ✨ Key Features

• **Multi-modal doubt solving** – ask questions via text or speech and receive instant answers powered by Google Gemini.

• **Real-time collaboration** – seamlessly switch to live audio rooms backed by LiveKit.

• **Context persistence** – Mem0 ensures every follow-up question carries prior context for coherent conversations.

• **Secure authentication** – Next-Auth provides social and email login flows.

• **Scalable data layer** – Neon Postgres + Prisma handle user accounts, sessions, and conversation histories.

---

## 🏗️ Tech Stack

| Layer        | Technology                     |
| ------------ | -----------------------------  |
| Frontend     | Next.js  • shadcn/ui           |
| Auth         | next-auth (Credentials, OAuth) |
| Realtime     | LiveKit Cloud / Self-hosted    |
| LLM          | Google Gemini 1.5 Pro          |
| State / Ctx  | Mem0                           |
| Database     | Neon Postgres                  |
| ORM          | Prisma                         |
| Backend API  | Python 3.11 • Flask            |

---

## 📂 Project Structure

```text
askme-main/
├─ askme-frontend/      # Next.js application
├─ askme-backend/       # FastAPI server
├─ storage/             # Shared images & static assets
└─ README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

• Node.js ≥ 18  •  npm or pnpm  
• Python ≥ 3.11  
• A Neon Postgres account  
• LiveKit Cloud project key (or self-hosted server)  
• Google Gemini API key  

### 2. Clone & Install

```bash
git clone https://github.com/ayushgupta4002/askMe.git
cd askMe.in
```

#### Frontend
```bash
cd askme-frontend
npm install
```

#### Backend
```bash
cd ../askme-backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🔧 Configuration

Create the following environment variable files (examples included):

### `askme-frontend/.env.local`
```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
LIVEKIT_URL=wss://<your>.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

```

### `askme-backend/.env`
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
LIVEKIT_URL=wss://<your>.livekit.cloud
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
GEMINI_API_KEY=
SARVAM_API_KEY=
```

Generate the Prisma client & migrate:
```bash
cd askme-backend
prisma migrate deploy
prisma generate
```

---

## 🏃‍♂️ Running Locally

Open **two** terminal windows/tabs:

1. **Frontend**  
   ```bash
   cd askme-frontend
   npm run dev
   ```
   Visit <http://localhost:3000>.

2. **Backend**  
   ```bash
   cd askme-backend
   uvicorn main:app --reload
   ```
   The API will be available at <http://localhost:5000>.

### 🎙️ LiveKit Audio Agent

The file `askme-backend/audio.py` contains a **voice agent worker** that joins a LiveKit room, converts the user’s speech to text, streams it to Gemini in real-time, and then speaks the LLM’s response back into the room.

Key components inside `audio.py`:

• **Sarvam STT** – Low-latency Hindi speech-to-text (`language="hi-IN"`)

• **Gemini RealtimeModel** – Generates conversational replies with a natural “kore” voice.

Run the agent in a **separate terminal** after the backend API is up:

```bash
cd askme-backend
python audio.py dev 
```

Environment variables consumed by the agent (defined in `askme-backend/.env`):

```env
LIVEKIT_URL=wss://<your>.livekit.cloud
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

# Sarvam speech-to-text
SARVAM_API_KEY=

# Optional – Gemini customisation
GEMINI_API_KEY=
```

When the script starts it will connect to the configured LiveKit room. You can join the same room from the web UI to have a live voice conversation with the AI assistant.

---

## 📄 License

MIT © 2024 askMe.in contributors
