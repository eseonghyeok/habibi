import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, List } from 'antd';
import groundJpg from '../../../images/ground.png';
import profile1 from '../../../images/profile/1.jpg';
import profile2 from '../../../images/profile/2.jpg';
import profile3 from '../../../images/profile/3.jpg';

function DailyTeamPage() {
    const all = [
        { id: 0, name: "김형철" }, { id: 1, name: "송효석" }, { id: 2, name: "박재범" }, { id: 3, name: "권위준" }, { id: 4, name: "신종은" },
        { id: 5, name: "이정일" }, { id: 6, name: "조돈휘" }, { id: 7, name: "현종권" }, { id: 8, name: "곽영래" }, { id: 9, name: "정회화" },
        { id: 10, name: "김상명" }, { id: 11, name: "신종윤" }, { id: 12, name: "임필우" }, { id: 13, name: "이병철" },
        { id: 14, name: "강동균" }, { id: 15, name: "류희대" }, { id: 16, name: "여성진" }, { id: 17, name: "김영준" }, { id: 18, name: "장효준" },
        { id: 19, name: "정기택" }, { id: 20, name: "김정민" }, { id: 21, name: "정현준" }, { id: 22, name: "김주환" }, { id: 23, name: "이지철" }, 
        { id: 24, name: "김진호" }, { id: 25, name: "박진산" }, { id: 26, name: "임다훈" }, { id: 27, name: "강병준" }, { id: 28, name: "박찬용" },
        { id: 29, name: "이종범" }, { id: 30, name: "박기환" }, { id: 31, name: "정도식" }, { id: 32, name: "이주은" }, { id: 33, name: "권현택" },
        { id: 34, name: "이성혁" }, { id: 35, name: "이상욱" }, { id: 36, name: "박준영" },
        { id: 37, name: "윤한중" }, { id: 38, name: "전지민" }, { id: 39, name: "권순국" }, { id: 40, name: "조대인" }
    ];

    const [aTeam, setATeam] = useState([]);
    const [bTeam, setBTeam] = useState([]);
    const [cTeam, setCTeam] = useState([]);
    
    const [aResult, setAResult] = useState([]);
    const [bResult, setBResult] = useState([]);
    const [cResult, setCResult] = useState([]);
    const [aIds, setAIds] = useState([]);
    const [bIds, setBIds] = useState([]);
    const [cIds, setCIds] = useState([]);

    useEffect(() => { 
        Axios.get('/api/record/getDailyTeam')
        .then(response => {
            console.log(response.data)
            if(response.data.success) {
                const { A, B, C, Result } = response.data.dailyTeam;
                setAIds(A);
                setBIds(B);
                setCIds(C);
                setAResult(Result.A);
                setBResult(Result.B);
                setCResult(Result.C);
                const mapMembersWithProfile = (ids, profileImage) => 
                    all.filter(member => ids.includes(member.id))
                        .map(member => ({ ...member, image: profileImage }));

                setATeam(mapMembersWithProfile(A, profile1)); 
                setBTeam(mapMembersWithProfile(B, profile2)); 
                setCTeam(mapMembersWithProfile(C, profile3)); 
            } else {
                alert('오늘의 팀 정보 가져오기를 실패하였습니다.')
            }
        })  
    }, [])

    const plusWinByIds = (id) => {
        Axios.post('/api/record/plusWin', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('승리 반영을 실패하였습니다.')
                }
            })
    };

    const plusDrawByIds = (id) => {
        Axios.post('/api/record/plusDraw', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('무승부 반영을 실패하였습니다.')
                }
            })
    };

    const plusLoseByIds = (id) => {
        Axios.post('/api/record/plusLose', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('패배 반영을 실패하였습니다.')
                }
            })
    };

    const plusWinByTeam = (team) => {
        Axios.post('/api/record/winTeam', { team })
            .then(response => {
                if(response.data.success) {
                    //window.location.reload();
                } else {
                    alert('승리 횟수 반영을 실패하였습니다.')
                }
            })
    };

    const plusDrawByTeam = (team) => {
        Axios.post('/api/record/drawTeam', { team })
            .then(response => {
                if(response.data.success) {
                    //window.location.reload();
                } else {
                    alert('무승부 횟수 반영을 실패하였습니다.')
                }
            })
    };

    const plusLoseByTeam = (team) => {
        Axios.post('/api/record/loseTeam', { team })
            .then(response => {
                if(response.data.success) {
                    //window.location.reload();
                } else {
                    alert('패배 횟수 반영을 실패하였습니다.')
                }
            })
    };  

    let date = new Date();

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh", color: 'yellow' }}>
            <div style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover' }}>
                <div style={{ padding: "10px", color: 'white' }}>
                    <h1 style={{ fontSize: '27px', marginTop: '37px'}}>⚽ 오늘의 팀 승점기록 ⚽</h1>
                    <p>{date.toLocaleDateString()}</p>
                    <p>💡 각 팀의 경기 결과를 기록하여 승점을 부여합니다.</p>
                    <p>💡 승리:3점 / 무승무: 1점 / 패배: 0점</p>
                </div>

                {/* A팀 */}
                <div style={{ marginBottom: '20px', border: '2px solid red', padding: '10px', borderRadius: '8px', position: 'relative', overflow: 'hidden', minHeight: '330px' }}>
                    <h2 style={{ color: 'white', textAlign: 'center' }}>A팀</h2>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={aTeam}
                        renderItem={(member) => (
                            <List.Item>
                                <div style={{ textAlign: 'center' }}>
                                    <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                    <p style={{ color: 'white' }}>{member.name}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '2%',
                            right: '4%',
                            backgroundColor: 'rgb(42, 133, 251)',
                            padding: '10px',
                            borderRadius: '8px',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '14px',
                            width: '60px'
                        }}
                    >
                        <p style={{ margin: '5px 0' }}>승: <strong>{aResult.win}</strong></p>
                        <p style={{ margin: '5px 0' }}>무: <strong>{aResult.draw}</strong></p>
                        <p style={{ margin: '5px 0' }}>패: <strong>{aResult.lose}</strong></p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px', position: 'absolute', bottom: '2%', left: '4%' }}>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('A팀 승리를 반영하시겠습니까?')) {
                                    plusWinByTeam('A');
                                    plusWinByIds(aIds);
                                }
                            }} 
                            style={{ background: '#28a745', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('A팀 무승부를 반영하시겠습니까?')) {
                                    plusDrawByTeam('A');
                                    plusDrawByIds(aIds);
                                }
                            }}
                            style={{ background: '#6c757d', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('A팀 패배를 반영하시겠습니까?')) {
                                    plusLoseByTeam('A');
                                    plusLoseByIds(aIds);
                                }
                            }}
                            style={{ background: '#dc3545', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
                        </Button>
                    </div>
                </div>

                {/* B팀 */}
                <div style={{ marginBottom: '20px', border: '2px solid blue', padding: '10px', borderRadius: '8px', position: 'relative', overflow: 'hidden', minHeight: '330px' }}>
                    <h2 style={{ color: 'white', textAlign: 'center' }}>B팀</h2>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={bTeam}
                        renderItem={(member) => (
                            <List.Item>
                                <div style={{ textAlign: 'center' }}>
                                    <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                    <p style={{ color: 'white' }}>{member.name}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '2%',
                            right: '4%',
                            backgroundColor: 'rgb(42, 133, 251)',
                            padding: '10px',
                            borderRadius: '8px',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '14px',
                            width: '60px'
                        }}
                    >
                        <p style={{ margin: '5px 0' }}>승: <strong>{bResult.win}</strong></p>
                        <p style={{ margin: '5px 0' }}>무: <strong>{bResult.draw}</strong></p>
                        <p style={{ margin: '5px 0' }}>패: <strong>{bResult.lose}</strong></p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px', position: 'absolute', bottom: '2%', left: '4%' }}>
                    <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('B팀 승리를 반영하시겠습니까?')) {
                                    plusWinByTeam('B');
                                    plusWinByIds(bIds);
                                }
                            }} 
                            style={{ background: '#28a745', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('B팀 무승부를 반영하시겠습니까?')) {
                                    plusDrawByTeam('B');
                                    plusDrawByIds(bIds);
                                }
                            }}
                            style={{ background: '#6c757d', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('B팀 패배를 반영하시겠습니까?')) {
                                    plusLoseByTeam('B');
                                    plusLoseByIds(bIds);
                                }
                            }}
                            style={{ background: '#dc3545', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
                        </Button>
                    </div>
                </div>

                {/* C팀 */}
                <div style={{ marginBottom: '20px', border: '2px solid white', padding: '10px', borderRadius: '8px', position: 'relative', overflow: 'hidden', minHeight: '330px' }}>
                    <h2 style={{ color: 'white', textAlign: 'center' }}>C팀</h2>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={cTeam}
                        renderItem={(member) => (
                            <List.Item>
                                <div style={{ textAlign: 'center' }}>
                                    <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                    <p style={{ color: 'white' }}>{member.name}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '2%',
                            right: '4%',
                            backgroundColor: 'rgb(42, 133, 251)',
                            padding: '10px',
                            borderRadius: '8px',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '14px',
                            width: '60px'
                        }}
                    >
                        <p style={{ margin: '5px 0' }}>승: <strong>{cResult.win}</strong></p>
                        <p style={{ margin: '5px 0' }}>무: <strong>{cResult.draw}</strong></p>
                        <p style={{ margin: '5px 0' }}>패: <strong>{cResult.lose}</strong></p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px', position: 'absolute', bottom: '2%', left: '4%' }}>
                    <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('C팀 승리를 반영하시겠습니까?')) {
                                    plusWinByTeam('C');
                                    plusWinByIds(cIds);
                                }
                            }} 
                            style={{ background: '#28a745', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('C팀 무승부를 반영하시겠습니까?')) {
                                    plusDrawByTeam('C');
                                    plusDrawByIds(cIds);
                                }
                            }}
                            style={{ background: '#6c757d', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('C팀 패배를 반영하시겠습니까?')) {
                                    plusLoseByTeam('C');
                                    plusLoseByIds(cIds);
                                }
                            }}
                            style={{ background: '#dc3545', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailyTeamPage;
