import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import PasswordModal from '../adminPage/PasswordModal'
import background from '../../images/homepage.png'

function HomePage() {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    async function getMonthSchedule() {
      const [year, month, day] = dayjs().format('YYYY-MM-DD').split('-');
      if (localStorage.getItem('checkData') && (`${year}-${month}-${day}` === localStorage.getItem('checkData'))) {
        return;
      }

      const [playersData, calendarData] = await Promise.all([
        Axios.get('/api/players').then(r => r.data),
        Axios.get(`/api/calendars/date/${year}-${month}`).then(r => r.data).catch(() => null),
      ]);

      const sortByDay = arr => [...arr].sort((a, b) => a.day - b.day);
      const soccerEvents = sortByDay(calendarData?.content?.soccer || []);
      const etcEvents = sortByDay(calendarData?.content?.etc || []);

      const birthdayPlayers = playersData
        .filter(p => p.metadata.birth.slice(5, 7) === month)
        .sort((a, b) => a.metadata.birth.slice(8, 10).localeCompare(b.metadata.birth.slice(8, 10)));

      const renderEvents = (events) =>
        events.length === 0
          ? <p style={{ color: '#999' }}>일정 없음</p>
          : events.map(event => (
            <p key={event.id}>
              <span>{month}월 {event.day}일</span>
              {event.time && <span> {event.time}</span>}
              {' / '}
              <span style={{ fontWeight: 'bold' }}>{event.title}</span>
              {event.place && <span style={{ color: '#666' }}> ({event.place})</span>}
            </p>
          ));

      Modal.confirm({
        title: '이번달 일정',
        content: (
          <div>
            <p style={{ fontWeight: 'bolder' }}>🎉 생일자 목록</p>
            {birthdayPlayers.length === 0
              ? <p style={{ color: '#999' }}>생일자 없음</p>
              : birthdayPlayers.map(player => (
                <p key={player.id}>
                  <span>{month}월 {player.metadata.birth.slice(8, 10)}일 / </span>
                  <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                  {(player.metadata.alias && player.metadata.number) && (<span>, {player.metadata.alias}({player.metadata.number})</span>)}
                </p>
              ))
            }
            <br />
            <p style={{ fontWeight: 'bolder' }}>⚽ 축구 일정</p>
            {renderEvents(soccerEvents)}
            <br />
            <p style={{ fontWeight: 'bolder' }}>📌 기타 일정</p>
            {renderEvents(etcEvents)}
          </div>
        ),
        okText: '확인',
        cancelText: '하루 동안 보지 않기',
        icon: '📅',
        onCancel() {
          localStorage.setItem('checkData', `${year}-${month}-${day}`);
        }
      });
    }
    getMonthSchedule();
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const logoutSuccess = () => {
    Modal.confirm({
      content: '로그아웃 하시겠습니까?',
      okText: '확인',
      cancelText: '취소',
      onOk() {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        window.location.href = '/';
      }
    });
  };

  const recordModal = () => {
    Modal.info({
      icon: '📊',
      title: '경기 기록',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Button type="primary" href="/record/year" size="large" style={buttonStyle}>
            연도별 기록
          </Button>
          <Button type="primary" href="/record/month" size="large" style={buttonStyle}>
            월별 기록
          </Button>
          <Button type="primary" href="/record/day" size="large" style={buttonStyle}>
            경기별 기록
          </Button>
        </div>
      ),
      okText: '취소'
    });
  }

  const checkModal = () => {
    Modal.info({
      icon: '📝',
      title: '경기 체크',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Button type="primary" href="/record/teams" size="large" style={buttonStyle}>
            승점 체크
          </Button>
          <Button type="primary" href="/record/attendanceCheck" size="large" style={buttonStyle}>
            출석 체크
          </Button>
        </div>
      ),
      okText: '취소'
    });
  }

  const operationsModal = () => {
    Modal.info({
      icon: '📢',
      title: '운영 사항',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Button type="primary" href="/notification" size="large" style={buttonStyle}>
            공지 사항
          </Button>
          <Button type="primary" href="/suggestion" size="large" style={buttonStyle}>
            건의 사항
          </Button>
          <Button type="primary" href="/dues" size="large" style={buttonStyle}>
            회비 내역
          </Button>
        </div>
      ),
      okText: '취소'
    });
  }

  const buttonStyle = {
    width: '240px',
    height: '80px',
    fontSize: '23px',
    fontFamily: 'Verdana, sans-serif',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    fontWeight: 'bold',
    background: '#ffff00e6',
    color: 'black'
  };

  return (
    <div style={{ textAlign: 'center', display: 'flex', backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '50px', marginTop: '50px' }}>
        <Button type="primary" href="/record/rank" size="large" style={{...buttonStyle, height: '100px', background: ''}}>
          순위표 <p style={{ fontSize: '50px', marginRight: '-30px' }}>🏆</p>
        </Button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={operationsModal}  size="large" style={buttonStyle}>
          운영 사항 <p style={{ fontSize: '40px', marginRight: '-30px' }}>📢</p>
        </Button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" href="/player/list" size="large" style={buttonStyle}>
          선수 정보 <p style={{ fontSize: '40px', marginRight: '-30px' }}>👕</p>
        </Button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={recordModal}  size="large" style={buttonStyle}>
          경기 기록 <p style={{ fontSize: '40px', marginRight: '-30px' }}>📊</p>
        </Button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" href="/attendance" size="large" style={buttonStyle}>
          경기 명단 <p style={{ fontSize: '35px', marginRight: '-30px' }}>👥</p>
        </Button>
      </div>
      {isLoggedIn ? (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <Button type="primary" onClick={checkModal}  size="large" style={buttonStyle}>
              경기 체크 <p style={{ fontSize: '40px', marginRight: '-30px' }}>📝</p>
            </Button>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <Button type="primary" size="large" onClick={logoutSuccess} style={buttonStyle}>
              로그아웃 <p style={{ fontSize: '35px', marginRight: '-30px' }}>🔒</p>
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <Button type="primary" size="large" onClick={showModal} style={buttonStyle}>
            로그인 <p style={{ fontSize: '30px', marginRight: '-30px' }}>🔓</p>
          </Button>
          <PasswordModal visible={visible} onCancel={handleCancel} />
        </div>
      )}
    </div>
  );
}

export default HomePage;
