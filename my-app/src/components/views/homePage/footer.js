import React from 'react';

const footerStyle = {
  backgroundColor: '#1890ff', 
  color: 'white', 
  padding: '5px 0', 
  position: 'relative', 
  bottom: 0,
  width: '100%', 
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

function Footer() {
  return (
    <footer style={footerStyle}>
        <div style={{ marginLeft: '10px'}}>
            <p>
                하비비FC는 열정과 친목을 바탕으로 활동하는 풋살 동호회입니다.<br/>
                ● 연고지: 영등포구 (영등포공원 풋살경기장)<br/>
                ● 경기시간: 매주 일요일 낮
            </p>
        </div>
        <div style={{ marginRight: '10px'}}>
            <p>
                회장 : 신종윤<br/>
                운영진 : 정회화, 김주환, 김진호<br/>
                개발자 : 이성혁 (eseonghyeok@naver.com)
            </p>
        </div>
    </footer>
  );
}

export default Footer;
