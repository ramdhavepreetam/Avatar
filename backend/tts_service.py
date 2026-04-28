import base64
# Mapping of characters to visemes (simplified approximation)
VISEME_MAP = {
    'a': 'A', 'e': 'E', 'i': 'I', 'o': 'O', 'u': 'U',
    'm': 'M', 'b': 'M', 'p': 'M',
    'f': 'F', 'v': 'F',
    't': 'T', 'd': 'T', 's': 'T', 'z': 'T',
    'w': 'O', 'q': 'O',
    'r': 'R', 'l': 'T',
    'c': 'T', 'k': 'T', 'g': 'T',
    'n': 'T', 'j': 'T', 'y': 'I',
    'h': 'A', 'x': 'T'
}

def text_to_visemes(text: str, duration: float):
    """
    Mock function to generate visemes distributed evenly over the audio duration.
    In a real implementation (e.g. ElevenLabs), this comes natively from the API.
    """
    visemes = []
    
    # Exclude punctuation for timing
    clean_text = "".join([c for c in text.lower() if c.isalpha() or c.isspace()])
    letters = [c for c in clean_text if c.isalpha()]
    
    if not letters:
        return visemes

    # Very rough heuristic: each letter takes equal time
    time_per_letter = duration / len(letters)
    current_time = 0.0
    
    for c in letters:
        viseme = VISEME_MAP.get(c, 'default')
        visemes.append({
            "viseme": viseme,
            "start": round(current_time, 3),
            "end": round(current_time + time_per_letter, 3)
        })
        current_time += time_per_letter
        
    return visemes

import asyncio
import edge_tts

def synthesize_speech(text: str, voice: str = "en-US-ChristopherNeural"):
    """
    Returns base64 encoded audio and visemes.
    """
    # Define an async function to get the audio bytes from edge-tts
    async def _synthesize():
        communicate = edge_tts.Communicate(text, voice)
        audio_data = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data.extend(chunk["data"])
        return bytes(audio_data)

    # Run the async generation
    audio_bytes = asyncio.run(_synthesize())
    
    # Encode audio to base64
    audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
    
    # We estimate ~11 chars per second for English speech reading speed
    # as a rough duration heuristic for the mock.
    # A real implementation would parse actual audio metadata.
    estimated_duration = max(1.0, len(text) / 11.0) 
    
    visemes = text_to_visemes(text, estimated_duration)
    
    return audio_base64, visemes, estimated_duration
