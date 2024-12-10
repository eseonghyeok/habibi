import React, { useState } from 'react';
import awardpage from '../../images/award/awardpage.jpg'
import Jan from '../../images/award/player/jan-juhwan.png';
import Feb1 from '../../images/award/player/feb-hoihwa.png';
import Feb2 from '../../images/award/player/feb-juhwan.png';
import Mar from '../../images/award/player/mar-hoihwa.png';
import Apr from '../../images/award/player/apr-juhwan.png';
import May from '../../images/award/player/may-jongkwon.png';
import Jun from '../../images/award/player/jun-hoihwa.png';
import Jul from '../../images/award/player/jul-hoihwa.png';
import Aug from '../../images/award/player/aug-jongkwon.png';

function HallOfFamePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(8);

    const imageUrls = [Jan, Feb1, Feb2, Mar, Apr, May, Jun, Jul, Aug];
    const monthNames = ['2024 January', '2024 February 공동', '2024 February 공동', '2024 March', '2024 April', '2024 May', '2024 June', '2024 July', '2024 August'];

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
    };

    const arrowButtonStyle = {
        background: 'none',
        border: 'none',
        fontSize: '35px',
        color: 'white',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
    };

    const arrowButtonHoverStyle = {
        ...arrowButtonStyle,
        transform: 'scale(1.2)',
    };

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh", padding: "10px", backgroundImage: `url(${awardpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <h1 style={{ marginBottom: "70px", color: "white", fontSize: "30px" }}>🗽HABIBI 명예의 전당🗽</h1>
            <div>
                <h1 style={{ marginBottom: "-30px", color: "white", fontSize: "20px" }}>HABIBI FOOTBALL CLUB</h1>
                <h1 style={{ marginBottom: "-10px", color: "white", fontSize: "30px" }}>PLAYER OF THE MONTH</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        style={arrowButtonStyle}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={prevSlide}
                    >
                        &#10094;
                    </button>
                    <div style={{ position: 'relative' }}>
                        <h1 style={{ fontSize: '25px', marginBottom: '25px', color: 'white' }}>{monthNames[currentImageIndex]}</h1>
                        <img style={{ maxHeight: '400px' }} src={imageUrls[currentImageIndex]} alt={`Month MVP ${currentImageIndex + 1}`}/>
                    </div>
                    <button
                        style={arrowButtonStyle}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={nextSlide}
                    >
                        &#10095;
                    </button>
                </div>
            </div>  
        </div>
    );
}

export default HallOfFamePage;
