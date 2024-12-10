import React from 'react';
import { Button } from 'antd';
import background from '../../images/homepage.png'

function PastHabibiPage() {
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
                <Button type="primary" href="/chart/year" size="large" style={buttonStyle}>
                    2024 최종순위 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥇</p>
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" href="/chart/month" size="large" style={buttonStyle}>
                    2024 월간차트 <p style={{ fontSize: '40px', marginRight: '-30px'}}>🥈</p>
                </Button>
            </div>
        </div>
    );
}

export default PastHabibiPage;
