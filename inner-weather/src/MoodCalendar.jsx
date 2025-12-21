// src/MoodCalendar.jsx
import React, { useState } from 'react';
import { MOODS } from './moodConfig';

const MoodCalendar = ({ moodHistory }) => {
  const [selectedNote, setSelectedNote] = useState(null);

  const today = new Date();
  const currentMonth = today.getMonth(); 
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getMoodForDate = (day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodHistory[dateString];
  };

  const handleDayClick = (day, moodData) => {
    if (moodData && moodData.note) {
      setSelectedNote({
        date: `${today.toLocaleString('default', { month: 'long' })} ${day}`,
        text: moodData.note
      });
    } else {
      setSelectedNote(null);
    }
  };

  return (
    <div className="calendar-container">
      <h2>{today.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      
      {/* THE GRID */}
      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="calendar-header">{d}</div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}

        {daysArray.map(day => {
          const moodData = getMoodForDate(day);
          const moodConfig = moodData ? MOODS.find(m => m.value === moodData.value) : null;
          
          return (
            <div 
              key={day} 
              className={`calendar-day ${moodData ? 'has-data' : ''}`}
              onClick={() => handleDayClick(day, moodData)}
              style={{
                backgroundColor: moodConfig ? moodConfig.color : 'transparent',
                border: moodConfig ? `2px solid ${moodConfig.highlight}` : '1px solid #f0f0f0',
                cursor: moodData ? 'pointer' : 'default'
              }}
            >
              <span className="day-number">{day}</span>
              {/* Optional tiny dot to show there is a note */}
              {moodData?.note && <div className="note-dot" style={{background: moodConfig.highlight}}></div>}
            </div>
          );
        })}
      </div>

      {/* SECTION TO SHOW THE CLICKED NOTE */}
      {selectedNote && (
        <div className="note-display">
          <strong>{selectedNote.date}:</strong>
          <p>"{selectedNote.text}"</p>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;