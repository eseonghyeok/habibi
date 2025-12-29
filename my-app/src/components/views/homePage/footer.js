import React from 'react';

const footerStyle = {
  backgroundColor: 'yellow',
  color: 'black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80px',
  width: '100%',
  textAlign: 'center',
  backgroundImage: 'linear-gradient(to top, rgba(255, 255, 0, 1) 75%, rgba(255, 255, 0, 0.6))',
  bottom: 0
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <p style={{ fontSize: '10px' }}>
        하비비 운영 및 기타 건의사항 환영합니다.<br />
        ● hometown: 영등포구 (영등포공원 풋살경기장)<br />
        ● instagram: @habibi.footballclub<br /><br />
      </p>
    </footer>
  );
}

export default Footer;
