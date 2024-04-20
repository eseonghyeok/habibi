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
  position: 'fixed',
  bottom: 0
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <p style={{ fontSize: '10px' }}>
        사이트 기능 관련 건의사항 및 개선의견 환영합니다.<br/>
        ● hometown: 영등포구 (영등포공원 풋살경기장)<br/>
        ● instagram: @habibi.footballclub<br/><br/> 
        회장: 신종윤  /  운영진: 정회화, 김주환, 김진호  /  개발자: 이성혁 (eseonghyeok@naver.com)
      </p>
    </footer>
  );
}

export default Footer;
