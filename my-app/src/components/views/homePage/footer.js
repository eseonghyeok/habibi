import React from 'react';

// const footerStyle = {
//   backgroundColor: '#1890ff', 
//   color: 'white', 
//   bottom: 0,
//   width: '100%', 
//   display: 'flex',
//   alignItems: 'center',
//   textAlign: 'center'
// };

const footerStyle = {
  backgroundColor: '#1890ff', 
  color: 'white', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  textAlign: 'center'
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <p>
        ● 하비비FC는 열정과 친목을 바탕으로 활동하는 풋살 동호회입니다.<br/>
        ● 연고지: 영등포구 (영등포공원 풋살경기장)<br/>
        ● instagram: @habibi.footballclub<br/><br/> 
        회장: 신종윤  /  운영진: 정회화, 김주환, 김진호  /  개발자: 이성혁 (eseonghyeok@naver.com)
      </p>
    </footer>
  );
}

export default Footer;
