import React, { useState } from 'react';
import { Button } from 'antd';
import PasswordModal from '../adminPage/PasswordModal'

function HomePage() {
    const [visible, setVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const logoutSuccess = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        window.location.href = '/';
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
        fontWeight: 'bold'
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', height: '675px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Button type="primary" href="/chart/year" size="large" style={buttonStyle}>
                        올해의 랭킹 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥇</p>
                    </Button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Button type="primary" href="/chart/month" size="large" style={buttonStyle}>
                        이달의 랭킹 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥈</p>
                    </Button>
                </div>
                {/* <div style={{ marginBottom: '20px' }}>
                    <Button type="primary" href="/star" size="large" style={buttonStyle}>
                        명예의 전당 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🗽</p>
                    </Button>
                </div> */}
                {isLoggedIn ? (
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                            <Button type="primary" href="/attendance" size="large" style={buttonStyle}>
                                출석체크 <p style={{ fontSize: '35px', marginRight: '-30px'}}>📋</p>
                            </Button>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <Button type="primary" href="/chart/daily" size="large" style={buttonStyle}>
                                기록체크 <p style={{ fontSize: '35px', marginRight: '-30px'}}>⚽️</p>
                            </Button>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <Button type="primary" size="large" onClick={logoutSuccess} style={buttonStyle}>
                                로그아웃 <p style={{ fontSize: '35px', marginRight: '-30px'}}>🔒</p>
                            </Button>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <Button type="primary" href="/chart/minus" size="large" style={{width: '240px', height: '80px', background: 'red', fontSize: '23px', fontFamily: 'Verdana, sans-serif', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center',textDecoration: 'none',fontWeight: 'bold'}}>
                                기록수정 <p style={{ fontSize: '35px', marginRight: '-30px'}}>⚠️</p>
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
            </div>
        </div>
    );
}

export default HomePage;
