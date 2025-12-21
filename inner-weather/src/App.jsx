// src/App.jsx
import { useState, useEffect } from 'react'
import { MOODS } from './moodConfig'
import { Wind } from 'lucide-react'
import MoodCalendar from './MoodCalendar'
import './App.css'

function App() {
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('moodHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentMood, setCurrentMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newHistory = {
      ...moodHistory,
      [dateString]: { value: mood.value }
    };

    setMoodHistory(newHistory);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));
  };

  return (
    <div 
      className="app-container"
      style={{ 
        backgroundColor: currentMood ? currentMood.color : '#FDFBF7', 
      }}
    >
      <header className="header">
        <div className="logo">
          <Wind size={24} />
          <span>InnerWeather</span>
        </div>
      </header>

      <main className="main-content">
        <h1>How are you feeling?</h1>
        
        {/* --- HERE ARE THE RESTORED INSTRUCTIONS --- */}
        <p className="subtitle">
          Track your internal forecast. Click an icon below to log your mood for today.
        </p>

        <div className="mood-grid">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = currentMood?.value === mood.value;

            return (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                className={`mood-btn ${isSelected ? 'selected' : ''}`}
                style={{
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

        <div className={`message-box ${currentMood ? 'visible' : ''}`}>
           {currentMood ? currentMood.message : "Select a mood above"}
        </div>
        
        <div className="calendar-section">
           <MoodCalendar moodHistory={moodHistory} />
        </div>

      </main>
    </div>
  )
}

export default App