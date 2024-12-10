import React, { useState } from 'react';
import backgroud from '../../images/noti.jpg'

function NotiPage() {
    const [activeTab, setActiveTab] = useState('player');

    const notifications = {
        player: [
            <>
                ⚽️회원 수 <br />
                - 지인추천으로만 maximum 40명 <br />
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
                - 장기불참자 회칙 삭제
            </>,
            <>
                <br />
                ⚽️운영진 <br />
                - 회장 : 신종윤 010-6369-9841 <br />
                - 총무 : 정회화 010-7191-5128 <br />
                - 총무 : 김주환 010-7683-8315 <br />
                - 총무 : 김진호 010-2212-2168 <br />
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
                ⚽️무단불참비 - 10,000원 <br />
                - 당일 참석자 미참 시 : 10,000원 자진입금 <br />
                - 개인사정이 있을 시 운영진에게 연락하면 면제 <br />
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
                - 양면 유니폼 52,000원, 삼색조끼 10,000원 별도 <br />
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
                - 상·하반기에 한 번씩 진행 <br />
                - 예산 내에서 회비 일부 사용 <br />
                - 회식 불참자들에겐 불참보상 제공 <br />
                <span style={{ fontSize: 'smaller' }}>ex 스포츠타월, 배민상품권 등</span> <br />
            </>,
            <>
                <br />
                ⚽️경조사 <br />
                - 화환 배달 <br />
            </>
        ],
        award: [
            <>
                ⚽️선정 기준 <br />
                - 출석 1회당 5점 / 1골당 1점 / 1어시스트당 1점 <br />
                - 월간 MVP, 골든부츠 = 운영진 포함 <br />
                - 올해의 선수 = 운영진 미포함 <br />
            </>,
            <>
                <br />
                ⚽️팀원 익명투표 <br />
                - 후보 중 본인의 마음 속 최고의 하비비 플레이어에게 투표 <br />
                - 후보 : 연간 출석 20회 이상 인원(운영진 미포함) <br />
                - 1년에 한 번 12월말 진행 / 득표당 3점 <br />
            </>,
            <>
                <br />
                🥇월간 MVP 선정 <br />
                - 월간 랭킹 총 점수가 가장 높은 1등 = MVP <br />
                - 매 월마다 선정 <br />
                - 인스타 및 명예의전당 게시 / 수상 X <br />
            </>,
            <>
                <br />
                🦶골든부츠 선정 <br />
                - 연간 랭킹 총 점수가 가장 높은 1등 = 골든부츠 <br />
                - 1년에 한 번 12월말에 선정 <br />
                - 인스타 및 명예의전당 게시 / 수상 O <br />
            </>,
            <>
                <br />
                🏆올해의 선수 선정 <br />
                - 아래 3가지 점수의 합산 점수가 가장 높은 선수 <br />
                <span style={{ fontSize: 'smaller' }}>1. 연간 총 "출석"점수</span> <br />
                <span style={{ fontSize: 'smaller' }}>2. 월간 MVP 선정횟수 x5점</span> <br />
                <span style={{ fontSize: 'smaller' }}>3. 팀원 익명투표 점수</span> <br />
                - 1년에 한 번 12월말에 선정 <br />
                - 인스타 및 명예의전당 게시 / 수상 O <br />
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
