from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tts_service

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SynthesizeRequest(BaseModel):
    text: str
    voice: str = "en-US-ChristopherNeural"

@app.post("/synthesize")
def synthesize(request: SynthesizeRequest):
    audio_base64, visemes, duration = tts_service.synthesize_speech(request.text, request.voice)
    
    return {
        "audio": f"data:audio/mp3;base64,{audio_base64}",
        "visemes": visemes,
        "duration": duration
    }
