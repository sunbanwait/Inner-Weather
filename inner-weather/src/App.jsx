// src/App.jsx
import { useState } from 'react'
import { MOODS } from './moodConfig'
import { Wind } from 'lucide-react' // Using this for a logo icon
import './App.css'

function App() {
  const [currentMood, setCurrentMood] = useState(null)

  return (
    <div 
      className="app-container"
      style={{ 
        backgroundColor: currentMood ? currentMood.color : '#FDFBF7', // Default: Off-white
      }}
    >
      {/* 1. Website Header */}
      <header className="header">
        <div className="logo">
          <Wind size={24} />
          <span>InnerWeather</span>
        </div>
        {/* You could add login buttons here later! */}
      </header>

      {/* 2. Main Content */}
      <main className="main-content">
        <h1>How are you feeling?</h1>
        <p className="subtitle">
          Track your internal forecast. Click an icon below to log your mood for the day.
        </p>
        
        <div className="mood-grid">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = currentMood?.value === mood.value;

            return (
              <button
                key={mood.value}
                onClick={() => setCurrentMood(mood)}
                className={`mood-btn ${isSelected ? 'selected' : ''}`}
                style={{
                  // Only change background color if selected
                  backgroundColor: isSelected ? mood.highlight : 'white',
                  color: isSelected ? 'white' : mood.highlight
                }}
              >
                <Icon size={32} />
                <span>{mood.label}</span>
              </button>
            )
          })}
        </div>

        {currentMood && (
          <div className="message-box">
            {currentMood.message}
          </div>
        )}
      </main>
    </div>
  )
}

export default App