import React from 'react';
const Logo = require('../../images/logo.png');

const navbarStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '80px',
  backgroundColor: 'yellow',
  backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 0, 1) 75%, rgba(255, 255, 0, 0.6))'
};

const containerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};

const logoStyle = {
  width: '200px',
};

function Bar() {
  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <a href="/" style={{ textDecoration: 'none' }}><img src={Logo} alt="Logo" style={logoStyle} /></a>
      </div>
    </nav>
  );
}

export default Bar;
