// src/App.jsx
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

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
    setNote('');
    setView('history');
  };

  // --- CYCLING LOGIC ---
  const handleCalendarClick = (dateString) => {
    const currentEntry = moodHistory[dateString];
    const currentValue = currentEntry ? currentEntry.value : null;

    // Cycle: Sunny(5) -> Partly(4) -> Cloud(3) -> Rain(2) -> Storm(1) -> Empty(null)
    const cycleValues = [...MOODS.map(m => m.value), null];
    
    // Find current spot in the cycle. If not found (undefined), it returns -1
    const currentIndex = cycleValues.indexOf(currentValue);
    
    // Move to next spot. If index was -1, it becomes 0 (Start of cycle)
    const nextValue = cycleValues[(currentIndex + 1) % cycleValues.length];

    const newHistory = { ...moodHistory };

    if (nextValue === null) {
      delete newHistory[dateString]; // Remove entry if cycling to "Empty"
    } else {
      newHistory[dateString] = {
        ...currentEntry, 
        value: nextValue,
        note: currentEntry?.note || '' // Keep the note if it exists
      };
    }

    setMoodHistory(newHistory);
  };

  return (
    <div 
      className="app-container"
      style={{ backgroundColor: currentMood ? currentMood.color : '#FDFBF7' }}
    >
      <header className="header">
        <div className="logo">
          <Wind size={20} />
          <span>InnerWeather</span>
        </div>
      </header>

      <main className="main-content">
        
        {/* --- VIEW 1: LOGGING --- */}
        {view === 'log' && (
          <div className="fade-in">
            <h1>How are you feeling?</h1>
            
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

            <div className={`mood-message ${currentMood ? 'visible' : ''}`}>
               {currentMood ? currentMood.message : "..."}
            </div>

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
          <div className="fade-in">
             {/* FIXED: Title is back! */}
             <h1>Past Forecasts</h1>
             
             <div className="calendar-wrapper">
                <div className="calendar-section">
                   <MoodCalendar 
                     moodHistory={moodHistory} 
                     onDateClick={handleCalendarClick} 
                   />
                </div>
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