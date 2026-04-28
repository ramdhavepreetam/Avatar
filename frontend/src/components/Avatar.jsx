import React, { useEffect, useRef, useState } from 'react';

export default function Avatar({ syncData, avatarType = 'male' }) {
  const audioRef = useRef(null);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    if (!syncData || !audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handlePlay = () => setIsTalking(true);
    const handlePause = () => setIsTalking(false);
    const handleEnded = () => setIsTalking(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [syncData]);

  return (
    <div className="avatar-wrapper">
      <div className="avatar-image-container" style={{ position: 'relative', width: '600px', height: '337px', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', margin: '0 auto', backgroundColor: '#0b132b' }}>
        
        {/* Idle Image */}
        <img 
          src={`/${avatarType}_avatar.jpg`} 
          alt={`${avatarType} Avatar Idle`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: isTalking ? 'none' : 'block' 
          }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/600x337?text=Missing+avatar.jpg'
          }}
        />

        {/* Talking Video */}
        <video 
          src={`/${avatarType}_talking.mp4`} 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: isTalking ? 'block' : 'none' 
          }}
        />
      </div>

      {syncData && (
        <audio
          ref={audioRef}
          src={syncData.audioUrl}
          autoPlay
          controls
          className="audio-player"
          style={{ marginTop: '20px', width: '100%' }}
        />
      )}
    </div>
  );
}
