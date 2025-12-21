// src/App.jsx
import { useState } from 'react'
import { MOODS } from './moodConfig'
import { Wind, Calendar as CalendarIcon, Home } from 'lucide-react'
import MoodCalendar from './MoodCalendar'
import './App.css'

function App() {
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('moodHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentMood, setCurrentMood] = useState(null);
  const [note, setNote] = useState(''); 
  const [view, setView] = useState('log');

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
  };

  const handleSaveEntry = () => {
    if (!currentMood) return;

    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newHistory = {
      ...moodHistory,
      [dateString]: { 
        value: currentMood.value, 
        note: note 
      } 
    };

    setMoodHistory(newHistory);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));
    
    setNote('');
    setView('history');
  };

  return (
    <div 
      className="app-container"
      style={{ backgroundColor: currentMood ? currentMood.color : '#FDFBF7' }}
    >
      <header className="header">
        <div className="logo">
          <Wind size={24} />
          <span>InnerWeather</span>
        </div>
      </header>

      <main className="main-content">
        
        {/* --- VIEW 1: LOGGING --- */}
        {view === 'log' && (
          <div className="fade-in">
            <h1>How are you feeling?</h1>
            <p className="subtitle">
              Select your weather icon and write a small note.
            </p>
            
            {/* 1. Mood Icons */}
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

            {/* 2. THE RESTORED MESSAGE (Cute description) */}
            <div className={`mood-message ${currentMood ? 'visible' : ''}`}>
               {currentMood ? currentMood.message : "..."}
            </div>

            {/* 3. Text Area & Save Button */}
            <div className="input-area">
              <textarea 
                placeholder="Notes on your forecast..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mood-note"
              />
              
              <button 
                className="save-btn" 
                onClick={handleSaveEntry}
                disabled={!currentMood} 
              >
                Save Forecast
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 2: PAST FORECASTS --- */}
        {view === 'history' && (
          <div className="fade-in calendar-wrapper">
             <h1>Past Forecasts</h1>
             <p className="subtitle">Click a day to read your notes.</p>
             <div className="calendar-section">
                <MoodCalendar moodHistory={moodHistory} />
             </div>
          </div>
        )}

      </main>

      <nav className="bottom-nav">
        <button 
          className={view === 'log' ? 'active' : ''} 
          onClick={() => setView('log')}
        >
          <Home size={24} />
        </button>
        
        <button 
          className={view === 'history' ? 'active' : ''} 
          onClick={() => setView('history')}
        >
          <CalendarIcon size={24} />
        </button>
      </nav>
    </div>
  )
}

export default App