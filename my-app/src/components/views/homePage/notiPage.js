import React, { useState } from 'react';
import backgroud from '../../images/noti.jpg'

function NotiPage() {
    const [activeTab, setActiveTab] = useState('total');

    const notifications = {
        total: [
            <>
                <br />
                💛건의사항💛 <br />
                - 매주 [건의사항] 들을 예정 <br />
                - 운영진은 [건의사항]을 듣고 1주일간 상의 후 다음주 [건의사항]에 대한 입장 발표 <br />
                <br />
                # 매주 경기 모여 끝나고 인사 와 건의사항 같이 합니다. <br />
                # 건의사항은 온라인 단톡방에서도 가능! <br />
                # 즉 건의사항은 매주 열려있습니다. <br />
                <br />
                # 건의사항은 어떤 창구든 언제든 받는게 맞고 <br />
                # 필요에 따라 의사결정이 필요한 건은 팀원들의 의견 수렴 기간을 거쳐 결정하되 필요시 투표 진행 <br />
                # 팀 운영 및 발전을 위한 좋은 건의사항은 운영진 협의하에 매월 1회 커피쿠폰 제공가능 (월 1건 한정) <br />
            </>,
            <>
                <br />
                💛화합💛 <br />
                # 매주 경기 후 모여서 인사 후 집으로 복귀 ( 건의사항 및 인사 ) <br />
                # 바쁜 스케줄로 인한 인원 제외 <br />
            </>,
            <>
                <br />
                💛경기 및 팀선별💛 <br />
                - 승/무/패 기존과 같이 진행 <br />
                - 팀 뽑기 밸런스 맞춰서 선별 (기존과 같이 진행) <br />
                - 비매너 플레이 금지 <br />
                <span style={{ fontSize: 'smaller' }}>1. 라인 나간 공 멀리 차서 지연 시키는 행위 </span> <br />
                <span style={{ fontSize: 'smaller' }}>2. 거친 플레이, 욕설, 짜증 (조용히 부탁 권유) </span> <br />
            </>,
            <>
                <br />
                💛금지사항💛 <br />
                - <span style={{ fontWeight: 'bold' }}>팀원간 금전 문제 및 팀 분열 조장 가차없는 탈퇴 사유</span> <br />
            </>,
            <>
                <br />
                💛재능기부/물품제공💛 <br />
                - 운영진 협의 하 해당 인원 회비 조율 <br />
                <span style={{ fontSize: 'smaller' }}>《예시》</span><br />
                <span style={{ fontSize: 'smaller' }}>1. 혹서기 얼음제공</span> <br />
                <span style={{ fontSize: 'smaller' }}>2. 하비비 SNS용 프로필 사진 촬영 및 제공</span> <br />
                <span style={{ fontSize: 'smaller' }}>3. 유니폼 제작 시 디자인 등</span> <br />
            </>,
            <>
                ️<br />
                💛복장💛 <br />
                - 복장은 자율, 단 특정색 옷만 입는 행위 금지 <br />
                - 3색 모두 챙겨오거나 , 팀뽑기 인원 3인중 조율 <br />
            </>,
            <>
                ️<br />
                💛교류전에 대한 회칙💛 <br />
                - 공식경기인 일요일에 구장을 못구해서 매치를 할 때 등 특수한 경우 지원 <br />
                - 일요일 외 토요일, 기타 평일 등은 형평성에 따라 미지원 <br />
            </>,
            <>
                ️<br />
                💛새로운 인원 선별💛 <br />
                - 1달 출석 및 기본기 심사후 본방 입장 ( 현 심사방 개설 완료 ) <br />
                - 지인이라고 무조건 받아주는 것 없음 ( 무조건 위 사항 충족 후 본방 입장 ) <br />
                - 현 25년 가을까지는 새인원 선별x <br />
            </>,
            <>
                ️<br />
                💛회식 및 MT💛 <br />
                - 회식 및 MT 날짜 연간 스케줄 미리 선정 후 공지 <br />
                <span style={{ fontSize: 'smaller' }}># 회식 상/하반기 총 2회 </span> <br />
                <span style={{ fontSize: 'smaller' }}># MT 1회 </span> <br />
            </>,
        ],
        player: [
            <>
                ⚽️회원 수 <br />
                - 맥시멈 40명 <br />
                - 1달간 출석 및 기본기 심사후 본방 입장 <br />
            </>,
            <>
                <br />
                ⚽️용병 <br />
                - 필요 시 토요일 정오 이후부터 구인 <br />
                - 참여 시간 관계없이 5천원 (2만원/4주 개념) <br />
            </>,
            <>
                <br />
                ⚽️장기불참자 <br />
                - 사유무관 회비 20,000원 <br />
                - 장기불참자 회칙 삭제 <br />
            </>,
            <>
                <br />
                ⚽️운영진 <br />
                - 회장 : 김진호 010-2212-2168 <br />
                - 총무 : 정회화 010-7191-5128 <br />
                - 운영진 : 김주환 010-7683-8315 <br />
                - 운영진 : 신종윤 010-6369-9841 <br />
            </>,
        ],
        tax: [
            <>
                <br />
                ⚠️지각,노쇼로 인한 정상적인 경기운영에 차질발생, <br />
                ⚠️정시에 참석한 회원들에게 피해가 발생하여 <br />
                ⚠️지각&노쇼에 대한 벌금을 강화합니다. <br />
                <br />
                ⚠️개인 일정을 고려하여 참석여부/시간투표 요망 <br />
                ⚠️투표시간에 맞춰 늦지않게 참석 부탁드립니다. <br />
                <br />
                👏10분전 도착하여 부상방지를 위해 몸도 풀고 <br />
                👏준비하여 여유있게 경기하면 좋겠습니다. <br />
            </>,
            <>
                <br />
                ⚽️당일 불참 시 - 10,000원 자진입금 <br />
                - 단, 피치못할 사유는 임원진 협의하여 면제여부 결정 <br />
                <span style={{ fontSize: 'smaller' }}>ex. 교통사고, 가족상 등</span> <br />
                - 하루 전 참석 불가 사전통보 시 면제 (자정 기준)<br />
            </>,
            <>
                <br />
                ⚽️지각비 - 5,000원 <br />
                - 10시 킥오프 기준, 09:50까지 구장 앞 집결 권장 <br />
                - 10:05 이후 구장 도착 시 5,000원 자진입금 <br />
                - 늦참하는 회원도 각 시간대에 맞게 동일 적용 <br />
                - 1시간 이상 지각은 노쇼와 동일벌금 적용(1만원) <br />
            </>,
            <>
                ⚽️회비 <br />
                - 전원 2만원, 매월25일 납부 <br />
                - 단면 유니폼 <br />
                <span style={{ fontSize: 'smaller' }}># 기존회원 회비지원(32,000원)+개인납부(15,000원)</span> <br />
                <span style={{ fontSize: 'smaller' }}># 새로운 인원 개인납부(47,000원)</span> <br />
                - 삼색조끼 10,000원 별도 <br />
            </>,
            <>
                ️<br />
                ⚽️구장예약 <br />
                - 구장예약 성공 후 실제 진행시 해당 <br />
                - 현금지급개념 X <br />
                - 익월 회비 5천원 차감 <br />
                <span style={{ fontSize: 'smaller' }}>ex.</span> <br />
                <span style={{ fontSize: 'smaller' }}>7월말에 8월구장 예약 성공</span> <br />
                <span style={{ fontSize: 'smaller' }}>해당 8월 예약구장에서 실제 경기 진행시</span> <br />
                <span style={{ fontSize: 'smaller' }}>8월말 납부하는 9월 회비에서 차감</span> <br />
            </>,
        ],
        event: [
            <>
                ⚽️축구 <br />
                - 월 1회 큰구장 확보 시도하여, 성공 시 11:11 진행 <br />
            </>,
            <>
                <br />
                ⚽️회식 <br />
                - 상·하반기에 한 번씩 진행 ( 미리 공지 ) <br />
                - 예산 내에서 회비 일부 사용 <br />
            </>,
            <>
                <br />
                ⚽️경조사 <br />
                - 화환 배달 <br />
            </>
        ],
        award: [
            <>
                ⚽️승/무/패 규칙 <br />
                - 승 3점 / 무 1점 / 패 0점 <br />
                - 매년 12월말 하비비 웹 사이트 기록으로 1~6위 베스트 팀 선정 <br />
                - 베스트팀 한정 상품 증정 <br />
            </>,
            <>
                <br />
                ⚽️출석 규칙 <br />
                - 매년 12월말 하비비 웹 사이트 기록으로 최다 출석왕 선정 <br />
                - 출석왕 한정 상품 증정 <br />
            </>
        ],
    };

    const renderNotifications = (genre) => {
        return notifications[genre].map((noti, index) => (
            <li key={index}>{noti}</li>
        ));
    };

    const buttonStyle = {
        backgroundColor: '#ff0',
        color: 'black',
        textAlign: 'center',
        margin: '10px',
        borderRadius: '5px',
        borderColor: '#ff0',
        cursor: 'pointer',
        padding: '8px'
    };

    return (
        <div style={{ textAlign: 'left', backgroundImage: `url(${backgroud})`, backgroundColor: '#FAF9F6', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ marginBottom: "10px", color: "white", fontSize: "34px" }}>📢하비비 공지사항📢</h1>
            <p style={{ fontSize: '15px', color: "#fff" }}>💡궁금하신 문의사항은 운영진에게 연락바랍니다.</p>
            <div style={{ marginBottom: '20px' }}>
                <button style={buttonStyle} onClick={() => setActiveTab('total')}>당부의 말씀</button>
                <button style={buttonStyle} onClick={() => setActiveTab('player')}>인원</button>
                <button style={buttonStyle} onClick={() => setActiveTab('tax')}>모임통장</button>
                <button style={buttonStyle} onClick={() => setActiveTab('event')}>이벤트</button>
                <button style={buttonStyle} onClick={() => setActiveTab('award')}>어워드</button>
            </div>
            <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', marginTop: '20px', borderRadius: '5px' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {renderNotifications(activeTab)}
                </ul>
            </div>
        </div>
    );
}

export default NotiPage;
