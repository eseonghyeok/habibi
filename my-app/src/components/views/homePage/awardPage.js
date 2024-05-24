import React, { useState } from 'react';
import Jan from './award/Jan.png';
import Feb from './award/Feb.png';
import Mar from './award/Mar.png';
import Apr from './award/Apr.png';

function HallOfFamePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imageUrls = [Jan, Feb, Mar, Apr];
    const monthNames = ['1월', '2월', '3월', '4월'];

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
    };

    return (
        <div style={{ textAlign: 'center', minHeight: '600px' }}>
            <h1 style={{ marginBottom: "10px", color: "black", fontSize: "30px" }}>🗽명예의 전당🗽</h1>
            <div>
                <h1 style={{ marginBottom: "10px", color: "black", fontSize: "15px" }}>월간 MVP</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button onClick={prevSlide} style={{ marginRight: '10px' }}>&#10094;</button>
                    <div style={{ position: 'relative' }}>
                        <div>{monthNames[currentImageIndex]}</div>
                        <img src={imageUrls[currentImageIndex]} alt={`Month MVP ${currentImageIndex + 1}`} style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                    <button onClick={nextSlide} style={{ marginLeft: '10px' }}>&#10095;</button>
                </div>
            </div>  
        </div>
    );
}

export default HallOfFamePage;
