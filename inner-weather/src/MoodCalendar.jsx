// src/MoodCalendar.jsx
import React, { useState } from 'react';
import { MOODS } from './moodConfig';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MoodCalendar = ({ moodHistory, onDateClick }) => {
  const [displayDate, setDisplayDate] = useState(new Date());
  
  // NEW: We track what the mouse is hovering over, not what is clicked
  const [hoveredDateStr, setHoveredDateStr] = useState(null);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getMoodForDate = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodHistory[dateString];
  };

  const handleDayClick = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Only cycle the mood, don't worry about selecting for view
    if (onDateClick) {
      onDateClick(dateString);
    }
  };

  const nextMonth = () => setDisplayDate(new Date(year, month + 1, 1));
  const prevMonth = () => setDisplayDate(new Date(year, month - 1, 1));

  // --- LOGIC: What text do we show in the bottom box? ---
  const getDisplayContent = () => {
    // Case 1: Mouse is NOT on a day
    if (!hoveredDateStr) {
      return {
        header: "Forecast Details",
        isPlaceholder: true
      };
    }

    // Case 2: Mouse IS on a day, but there is no data
    const data = moodHistory[hoveredDateStr];
    
    // Format the date nicely (e.g., "December 21")
    const [y, m, d] = hoveredDateStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    const niceDate = dateObj.toLocaleString('default', { month: 'long', day: 'numeric' });

    if (!data) {
      return {
        header: niceDate,
        body: "No forecast recorded.",
        isPlaceholder: true
      };
    }

    // Case 3: Mouse IS on a day with data
    const config = MOODS.find(m => m.value === data.value);
    return {
      header: `${niceDate} • ${config ? config.message : ''}`,
      body: data.note || "No note written for this day.",
      isPlaceholder: false
    };
  };

  const displayContent = getDisplayContent();

  return (
    <div className="calendar-container">
      
      <div className="calendar-nav-header">
        <button onClick={prevMonth} className="nav-btn">
          <ChevronLeft size={20} />
        </button>
        <h2>{displayDate.toLocaleString('default', { month: 'long' })} {year}</h2>
        <button onClick={nextMonth} className="nav-btn">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="calendar-header">{d}</div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}

        {daysArray.map(day => {
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const moodData = moodHistory[dateString]; // Direct lookup
          const moodConfig = moodData ? MOODS.find(m => m.value === moodData.value) : null;
          const IconComponent = moodConfig ? moodConfig.icon : null;
          
          return (
            <div 
              key={day} 
              className={`calendar-day ${moodData ? 'has-data' : ''}`}
              onClick={() => handleDayClick(day)}
              // NEW: Hover listeners
              onMouseEnter={() => setHoveredDateStr(dateString)}
              onMouseLeave={() => setHoveredDateStr(null)}
              style={{
                backgroundColor: moodConfig ? moodConfig.color : 'transparent',
                /* FIXED: Both conditions now use 2px solid to prevent jumping size */
                border: moodConfig ? `2px solid ${moodConfig.highlight}` : '2px solid #f0f0f0',
                cursor: 'pointer'
              }}
            >
              <span className="day-number">{day}</span>
              {IconComponent && (
                <div className="calendar-icon-wrapper">
                  <IconComponent size={20} color={moodConfig.highlight} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- ALWAYS VISIBLE NOTE BOX --- */}
      <div 
        className="note-display"
        style={{ minHeight: '80px', transition: 'opacity 0.2s' }} // Prevent jumping
      >
        <strong style={{ opacity: displayContent.isPlaceholder ? 0.5 : 1 }}>
          {displayContent.header}
        </strong>
        <p style={{ opacity: displayContent.isPlaceholder ? 0.6 : 1, fontStyle: displayContent.isPlaceholder ? 'italic' : 'normal' }}>
          {displayContent.body}
        </p>
      </div>
    </div>
  );
};

export default MoodCalendar;