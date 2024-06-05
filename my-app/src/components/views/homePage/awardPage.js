import React, { useState } from 'react';
import awardpage from './awardpage.jpg'
import Jan from './award/player/jan-juhwan.png';
import Feb1 from './award/player/feb-hoihwa.png';
import Feb2 from './award/player/feb-juhwan.png';
import Mar from './award/player/mar-hoihwa.png';
import Apr from './award/player/apr-juhwan.png';

function HallOfFamePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imageUrls = [Jan, Feb1, Feb2, Mar, Apr];
    const monthNames = ['2024 January', '2024 February 공동', '2024 February 공동', '2024 March', '2024 April'];

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
    };

    const arrowButtonStyle = {
        marginRight: '10px',
        marginLeft: '10px',
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
