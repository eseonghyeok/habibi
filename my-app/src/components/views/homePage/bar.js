import React, { useState } from 'react';
import CalendarModal from './CalendarModal';

const Logo = require('../../images/logo.png');

const navbarStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '80px',
  backgroundColor: 'yellow',
  backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 0, 1) 75%, rgba(255, 255, 0, 0.6))'
};

const logoStyle = {
  width: '200px',
};

function Bar() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <nav style={navbarStyle}>
      <div style={{ flex: 1 }} />
      <div>
        <a href="/" style={{ textDecoration: 'none' }}>
          <img src={Logo} alt="Logo" style={logoStyle} />
        </a>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '20px' }}>
        <span
          style={{ fontSize: '32px', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCalendarOpen(true)}
          title="달력"
        >
          📅
        </span>
      </div>
      <CalendarModal open={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </nav>
  );
}

export default Bar;
