# FaceAvatar: AI Interview Lip-Sync Prototype

FaceAvatar is a full-stack web application prototype that demonstrates an AI avatar lip-syncing to generated speech. You can type in any question or phrase, choose a realistic neural voice, and watch the avatar "speak" your text!

## Features

- **Interactive Avatar**: A video-based avatar that simulates lip-syncing by syncing video playback to the generated audio's estimated visemes.
- **High-Quality Neural TTS**: Utilizes `edge-tts` on the backend to generate extremely realistic, human-like voices (Microsoft Edge TTS).
- **Multiple Voice Options**: Choose between different male and female voices directly from the user interface:
  - Male (Christopher)
  - Male (Guy)
  - Female (Aria)
  - Female (Jenny)
- **FastAPI Backend**: A lightweight, fast Python backend that processes the TTS generation.
- **React/Vite Frontend**: A modern, responsive frontend built with React and Vite.

## Architecture

The project is split into two main directories:

1. `backend/`: A Python **FastAPI** server that exposes a `/synthesize` endpoint. It receives text and a selected voice, generates the audio using `edge-tts`, creates a simulated viseme map, and returns the audio as base64 data.
2. `frontend/`: A **React** application (bootstrapped with Vite). It handles the user interface, sends API requests to the backend, and uses an `<audio>` and `<video>` element to sync the avatar's lip movements to the TTS audio.

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)

## Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment and activate it:

```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
.\venv\Scripts\activate
```

Install the dependencies:

```bash
pip install fastapi uvicorn pydantic edge-tts
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The backend will be running at `http://localhost:8000`.

### 2. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install the required Node packages:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`. Open this URL in your browser to interact with the application.

## How it Works

1. The user types a message and selects a voice in the React UI.
2. The frontend sends a `POST` request to `http://localhost:8000/synthesize`.
3. The FastAPI backend uses `edge-tts` to generate an audio stream for the requested text and voice.
4. The backend calculates an estimated duration and creates a basic "viseme map" to represent lip movements over time.
5. The audio is encoded to base64 and returned alongside the viseme data.
6. The React `Avatar.jsx` component takes this data, plays the base64 audio, and uses a `requestAnimationFrame` loop to match the current audio playback time with the simulated visemes—jumping the video to specific frames to make it look like the avatar is speaking!

## API Usage

You can use the FastAPI backend as a standalone API to generate synchronized audio and visemes for any frontend or application. 

**Endpoint**: `http://localhost:8000/synthesize`
**Method**: `POST`

### Request Format
Send a JSON payload containing the `text` you want spoken and the `voice` you want to use.

**cURL Example:**
```bash
curl -X POST http://localhost:8000/synthesize \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello, welcome to this AI interview!", "voice": "en-US-AriaNeural"}'
```

**Python Example:**
```python
import requests

url = "http://localhost:8000/synthesize"
payload = {
    "text": "Hello, welcome to this AI interview!",
    "voice": "en-US-AriaNeural"
}

response = requests.post(url, json=payload)
data = response.json()

print("Visemes:", data["visemes"])
# Base64 audio string is available in data["audio"]
```

### Response Format
The API responds with JSON containing:
- `audio`: A Base64 encoded string representing the `.mp3` audio file.
- `visemes`: An array of timing events (`offset` in milliseconds and `viseme_id`) mapping when the mouth should open and close.

## Future Enhancements

- Integrate a large language model (LLM) so the avatar can have intelligent, autonomous conversations.
- Use a dedicated lip-sync library (like Rhubarb Lip Sync) for more accurate, phoneme-based viseme mappings.
- Host the application using Docker, Google Cloud Run, or Firebase Hosting.

## License

This project is licensed under the MIT License.
