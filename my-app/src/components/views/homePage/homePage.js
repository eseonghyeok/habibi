import React, { useState } from 'react';
import { Button } from 'antd';
import PasswordModal from '../adminPage/PasswordModal'
import background from '../../images/homepage.png'

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
                <Button type="primary" href="/record/year" size="large" style={buttonStyle}>
                    올해의 랭킹 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥇</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/record/month" size="large" style={buttonStyle}>
                    이달의 랭킹 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥈</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/award" size="large" style={buttonStyle}>
                    명예의 전당 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🗽</p>
                </Button>
            </div>
            {isLoggedIn ? (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" href="/record/plus" size="large" style={buttonStyle}>
                            기록체크 <p style={{ fontSize: '35px', marginRight: '-30px'}}>⚽️</p>
                        </Button>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" href="/record/minus" size="large" style={buttonStyle}>
                            기록차감 <p style={{ fontSize: '35px', marginRight: '-30px'}}>⚠️</p>
                        </Button>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <Button type="primary" href="/attendance" size="large" style={buttonStyle}>
                            출석체크 <p style={{ fontSize: '35px', marginRight: '-30px'}}>📋</p>
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
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/past" size="large" style={buttonStyle}>
                    하비비 2024 <p style={{ fontSize: '40px', marginRight: '-30px'}}>💛</p>
                </Button>
            </div>
        </div>
    );
}

export default HomePage;
