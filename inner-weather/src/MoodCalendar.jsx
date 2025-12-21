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

  // UPDATED: Now accepts moodConfig to get the message
  const handleDayClick = (day, moodData, moodConfig) => {
    if (moodData && moodData.note) {
      setSelectedNote({
        date: `${today.toLocaleString('default', { month: 'long' })} ${day}`,
        text: moodData.note,
        moodMessage: moodConfig ? moodConfig.message : '' // Get the description
      });
    } else {
      setSelectedNote(null);
    }
  };

  return (
    <div className="calendar-container">
      <h2>{today.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      
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
          
          // UPDATED: Get the specific icon component if data exists
          const IconComponent = moodConfig ? moodConfig.icon : null;

          return (
            <div 
              key={day} 
              className={`calendar-day ${moodData ? 'has-data' : ''}`}
              // UPDATED: Pass moodConfig to the handler
              onClick={() => handleDayClick(day, moodData, moodConfig)}
              style={{
                backgroundColor: moodConfig ? moodConfig.color : 'transparent',
                border: moodConfig ? `2px solid ${moodConfig.highlight}` : '1px solid #f0f0f0',
                cursor: moodData ? 'pointer' : 'default'
              }}
            >
              <span className="day-number">{day}</span>
              
              {/* UPDATED: Display the Icon instead of the dot */}
              {IconComponent && (
                <div className="calendar-icon-wrapper">
                  <IconComponent size={20} color={moodConfig.highlight} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* UPDATED: Note Display Section */}
      {selectedNote && (
        <div className="note-display">
          <strong>
             {/* Matches your requested format: DATE • MOOD */}
             {selectedNote.date} &bull; {selectedNote.moodMessage}
          </strong>
          <p>"{selectedNote.text}"</p>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;