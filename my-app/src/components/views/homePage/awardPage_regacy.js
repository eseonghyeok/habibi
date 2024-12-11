// import React from 'react';
// import awardpage from '../../images/award/awardpage.jpg';
// import Jan from '../../images/award/player/jan-juhwan.png';
// import Feb1 from '../../images/award/player/feb-hoihwa.png';
// import Feb2 from '../../images/award/player/feb-juhwan.png';
// import Mar from '../../images/award/player/mar-hoihwa.png';
// import Apr from '../../images/award/player/apr-juhwan.png';
// import May from '../../images/award/player/may-jongkwon.png';
// import Jun from '../../images/award/player/jun-hoihwa.png';
// import Jul from '../../images/award/player/jul-hoihwa.png';
// import Aug from '../../images/award/player/aug-jongkwon.png';

// function HallOfFamePage() {
//     const imageUrls = [
//         { src: Jan, month: '2024 January' },
//         { src: Feb1, month: '2024 February 공동' },
//         { src: Feb2, month: '2024 February 공동' },
//         { src: Mar, month: '2024 March' },
//         { src: Apr, month: '2024 April' },
//         { src: May, month: '2024 May' },
//         { src: Jun, month: '2024 June' },
//         { src: Jul, month: '2024 July' },
//         { src: Aug, month: '2024 August' },
//     ];

//     return (
//         <div
//             style={{
//                 textAlign: 'center',
//                 minHeight: '100vh',
//                 padding: '10px',
//                 backgroundImage: `url(${awardpage})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//             }}
//         >
//             <h1 style={{ marginBottom: '70px', color: 'white', fontSize: '30px' }}>🗽HABIBI 명예의 전당🗽</h1>
//             <div>
//                 <h1 style={{ marginBottom: '-30px', color: 'white', fontSize: '20px' }}>HABIBI FOOTBALL CLUB</h1>
//                 <h1 style={{ marginBottom: '-10px', color: 'white', fontSize: '30px' }}>PLAYER OF THE MONTH</h1>
//                 <div
//                     style={{
//                         display: 'grid',
//                         gridTemplateColumns: 'repeat(4, 1fr)',
//                         gap: '20px',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         marginTop: '40px',
//                     }}
//                 >
//                     {imageUrls.map((item, index) => (
//                         <div
//                             key={index}
//                             style={{
//                                 backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                                 borderRadius: '10px',
//                                 padding: '10px',
//                                 color: 'white',
//                                 textAlign: 'center',
//                             }}
//                         >
//                             <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>{item.month}</h3>
//                             <img
//                                 style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px' }}
//                                 src={item.src}
//                                 alt={`MVP ${item.month}`}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default HallOfFamePage;
