import React from 'react';

const HallOfFamePage = () => {
    // 명예의 전당에 전시할 이미지 URL 배열
    const imageUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        // 필요한 만큼 이미지 URL을 추가합니다.
    ];

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>명예의 전당</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {imageUrls.map((imageUrl, index) => (
                    <div key={index} style={{ margin: '10px' }}>
                        <img src={imageUrl} alt={`Hall of Fame ${index + 1}`} style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HallOfFamePage;