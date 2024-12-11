import React from 'react';
import awardpage from '../../images/award/awardpage.jpg';
import Jan from '../../images/award/player/jan-juhwan.png';
import Feb1 from '../../images/award/player/feb-hoihwa.png';
import Feb2 from '../../images/award/player/feb-juhwan.png';
import Mar from '../../images/award/player/mar-hoihwa.png';
import Apr from '../../images/award/player/apr-juhwan.png';
import May from '../../images/award/player/may-jongkwon.png';
import Jun from '../../images/award/player/jun-hoihwa.png';
import Jul from '../../images/award/player/jul-hoihwa.png';
import Aug from '../../images/award/player/aug-jongkwon.png';
import Sep1 from '../../images/award/player/sep-jinho.png';
import Sep2 from '../../images/award/player/sep-juhwan.png';
import Oct from '../../images/award/player/oct-jinho.png';
import Nov from '../../images/award/player/nov-jinho.png';

function HallOfFamePage() {
    const imageUrls = [
        { src: Jan, month: '1월 MVP 김주환' },
        { src: Feb1, month: '2월 MVP 정회화' },
        { src: Feb2, month: '2월 MVP 김주환' },
        { src: Mar, month: '3월 MVP 정회화' },
        { src: Apr, month: '4월 MVP 김주환' },
        { src: May, month: '5월 MVP 현종권' },
        { src: Jun, month: '6월 MVP 정회화' },
        { src: Jul, month: '7월 MVP 정회화' },
        { src: Aug, month: '8월 MVP 현종권' },
        { src: Sep1, month: '9월 MVP 김진호' },
        { src: Sep2, month: '9월 MVP 김주환' },
        { src: Oct, month: '10월 MVP 김진호' },
        { src: Nov, month: '11월 MVP 김진호' },
    ];

    return (
        <div
            style={{
                textAlign: 'center',
                minHeight: '100vh',
                padding: '10px',
                backgroundImage: `url(${awardpage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <h1 style={{ marginBottom: '70px', color: 'white', fontSize: '20px' }}>HABIBI FOOTBALL CLUB</h1>
            <h1 style={{ marginBottom: '70px', color: 'white', fontSize: '30px' }}>🗽2024 명예의 전당🗽</h1>
            <div>
                <h1 style={{ marginBottom: '-10px', color: 'white', fontSize: '30px' }}>🏆PLAYER OF THE YEAR🏆</h1>
            </div>
            <div>
                <h1 style={{ marginBottom: '-10px', color: 'white', fontSize: '30px' }}>🥇PLAYER OF THE MONTH🥇</h1>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '7px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '40px',
                    }}
                >
                    {imageUrls.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                borderRadius: '10px',
                                padding: '5px',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            <h3 style={{ marginBottom: '10px', fontSize: '10px' }}>{item.month}</h3>
                            <img
                                style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px' }}
                                src={item.src}
                                alt={`MVP ${item.month}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HallOfFamePage;
