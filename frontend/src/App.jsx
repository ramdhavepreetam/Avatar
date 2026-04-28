import { useState } from 'react'
import Avatar from './components/Avatar'
import './index.css'

function App() {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('en-US-ChristopherNeural')
  const [avatarType, setAvatarType] = useState('male')
  const [isLoading, setIsLoading] = useState(false)
  const [syncData, setSyncData] = useState(null)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice })
      })
      const data = await response.json()
      setSyncData({
        audioUrl: data.audio,
        visemes: data.visemes,
        text: text
      })
      setText('')
    } catch (error) {
      console.error("Error synthesizing speech:", error)
      alert("Failed to synthesize speech. Ensure the backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Interview Lip-Sync</h1>
        <p>Type a question to see the avatar respond.</p>
      </header>

      <main className="main-content">
        <div className="avatar-section">
          <Avatar syncData={syncData} avatarType={avatarType} />
        </div>
        
        <div className="input-section">
          <form onSubmit={handleSubmit} className="question-form">
            <div className="selectors" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select 
                value={avatarType} 
                onChange={(e) => setAvatarType(e.target.value)}
                disabled={isLoading}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="male">Male Avatar</option>
                <option value="female">Female Avatar</option>
              </select>
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                disabled={isLoading}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="en-US-ChristopherNeural">Male (Christopher)</option>
                <option value="en-US-GuyNeural">Male (Guy)</option>
                <option value="en-US-AriaNeural">Female (Aria)</option>
                <option value="en-US-JennyNeural">Female (Jenny)</option>
              </select>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="E.g., How does this lip-sync prototype work?"
              rows={4}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !text.trim()}>
              {isLoading ? 'Generating...' : 'Ask Question'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default App
