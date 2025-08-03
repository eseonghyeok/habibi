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
				async function getBirthdays() {
						const [year, month, day] = dayjs().format('YYYY-MM-DD').split('-');
						if (localStorage.getItem('checkData') && (`${year}-${month}-${day}` === localStorage.getItem('checkData'))) {
								return;
						}

						const playersData = (await Axios.get('/api/players')).data;
						Modal.confirm({
								title: '생일자 목록',
								content: (
										<div>
												<p style={{ fontWeight: 'bolder' }}>오늘 생일자</p>
												{playersData.map(player => {
							 							if (player.metadata.birth.slice(5, 10) === `${month}-${day}`) {
																return (
																		<p key={player.id}>
																				<span style={{ fontWeight: 'bold' }}>{player.name}</span>
																				{(player.metadata.alias && player.metadata.number) && (<span>, {player.metadata.alias}({player.metadata.number})</span>)}
                                    </p>
																)
														}
														return null;
												})}
												<br />
												<p style={{ fontWeight: 'bolder' }}>이번 달 생일자</p>
												{playersData.sort((a, b) => a.metadata.birth.slice(8, 10).localeCompare(b.metadata.birth.slice(8, 10))).map(player => {
							 							if (player.metadata.birth.slice(5, 7) === month) {
																return (
																		<p key={player.id}>
																				<span>{month}월 {player.metadata.birth.slice(8, 10)}일 / </span>
																				<span style={{ fontWeight: 'bold' }}>{player.name}</span>
																				{(player.metadata.alias && player.metadata.number) && (<span>, {player.metadata.alias}({player.metadata.number})</span>)}
																		</p>
																)
														}
														return null;
												})}
										</div>
								),
								okText: '확인',
								cancelText: '하루 동안 보지 않기',
								icon:'🎉',
								onCancel() {
										localStorage.setItem('checkData', `${year}-${month}-${day}`);
								}
					});
				}
				getBirthdays();
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
            <div style={{ marginBottom: '20px', marginTop: '50px' }}>
                <Button type="primary" href="/notification" size="large" style={buttonStyle}>
                    공지사항 <p style={{ fontSize: '40px', marginRight: '-30px'}}>📢</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/player/list" size="large" style={buttonStyle}>
                    선수 정보 <p style={{ fontSize: '40px', marginRight: '-30px'}}>👕</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/record/year" size="large" style={buttonStyle}>
                    연간 랭킹 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥇</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/record/month" size="large" style={buttonStyle}>
                    월간 랭킹 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥈</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/record/day" size="large" style={buttonStyle}>
                    경기 결과 <p style={{ fontSize: '35px', marginRight: '-30px'}}>✅</p>
                </Button>
            </div>
            {isLoggedIn ? (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" href="/attendance" size="large" style={buttonStyle}>
                            팀 나누기 <p style={{ fontSize: '35px', marginRight: '-30px'}}>🎭</p>
                        </Button>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" href="/record/teams" size="large" style={buttonStyle}>
                            승점 체크 <p style={{ fontSize: '35px', marginRight: '-30px'}}>📊</p>
                        </Button>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" href="/record/attendanceCheck" size="large" style={buttonStyle}>
                            출석 체크 <p style={{ fontSize: '35px', marginRight: '-30px'}}>📋</p>
                        </Button>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" size="large" onClick={logoutSuccess} style={buttonStyle}>
                            로그아웃 <p style={{ fontSize: '35px', marginRight: '-30px'}}>🔒</p>
                        </Button>
                    </div>
                </div>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    <Button type="primary" size="large" onClick={showModal} style={buttonStyle}>
                        로그인 <p style={{ fontSize: '30px', marginRight: '-30px'}}>🔓</p>
                    </Button>
                    <PasswordModal visible={visible} onCancel={handleCancel} />
                </div>
            )}
            {/* <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/past" size="large" style={buttonStyle}>
                    하비비 2024 <p style={{ fontSize: '40px', marginRight: '-30px'}}>💛</p>
                </Button>
            </div> */}
        </div>
    );
}

export default HomePage;
