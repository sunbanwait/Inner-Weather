// src/MoodCalendar.jsx
import React from 'react';
import { MOODS } from './moodConfig';

const MoodCalendar = ({ moodHistory }) => {
  // 1. Get current date details
  const today = new Date();
  const currentMonth = today.getMonth(); // 0 = Jan, 1 = Feb...
  const currentYear = today.getFullYear();

  // 2. Figure out how many days in this month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // 3. Figure out which day of the week the month starts on (for empty slots)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // 4. Create an array of days to render
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to find the mood for a specific day
  const getMoodForDate = (day) => {
    // Format date as YYYY-MM-DD to match our saved data
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodHistory[dateString];
  };

  return (
    <div className="calendar-container">
      <h2>{today.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      
      <div className="calendar-grid">
        {/* Days of the week headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-header">{d}</div>
        ))}

        {/* Empty slots for days before the 1st of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}

        {/* The actual days */}
        {daysArray.map(day => {
          const moodData = getMoodForDate(day);
          // Find the matching mood config to get the color
          const moodConfig = moodData ? MOODS.find(m => m.value === moodData.value) : null;

          return (
            <div 
              key={day} 
              className="calendar-day"
              style={{
                backgroundColor: moodConfig ? moodConfig.color : 'white',
                border: moodConfig ? `2px solid ${moodConfig.highlight}` : '1px solid #eee'
              }}
            >
              <span className="day-number">{day}</span>
              {/* Optional: Show small icon if mood exists */}
              {moodConfig && (
                <div className="mini-icon">
                  <moodConfig.icon size={14} color={moodConfig.highlight} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;