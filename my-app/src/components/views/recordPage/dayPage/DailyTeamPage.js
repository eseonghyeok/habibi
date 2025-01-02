import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import groundJpg from '../../../images/ground.png';
import list from '../../../images/playerlist.jpg';
import profile1 from '../../../images/profile/1.jpg';
import profile2 from '../../../images/profile/2.jpg';
import profile3 from '../../../images/profile/3.jpg';
import profile4 from '../../../images/profile/4.jpg';

function AttendancePage() {
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

    const [members, setMembers] = useState([]);
    const [aTeam, setATeam] = useState([]);
    const [bTeam, setBTeam] = useState([]);
    const [cTeam, setCTeam] = useState([]);
    const [generalTeam, setGeneralTeam] = useState([]);
    const [activeTeam, setActiveTeam] = useState('A');
    
    const [aResult, setAResult] = useState([]);
    const [bResult, setBResult] = useState([]);
    const [cResult, setCResult] = useState([]);
    const [aIds, setAIds] = useState([]);
    const [bIds, setBIds] = useState([]);
    const [cIds, setCIds] = useState([]);
    const [othersIds, setOthersIds] = useState([]);

    useEffect(() => { 
        Axios.get('/api/record/getDailyTeam')
        .then(response => {
            console.log(response.data)
            if(response.data.success) {
                const { A, B, C, Others, Result } = response.data.dailyTeam;
                setAIds(A);
                setBIds(B);
                setCIds(C);
                setOthersIds(Others);
                setAResult(Result.A);
                setBResult(Result.B);
                setCResult(Result.C);
                const mapMembersWithProfile = (ids, profileImage) => 
                    all
                        .filter(member => ids.includes(member.id))
                        .map(member => ({ ...member, image: profileImage }));

                setATeam(mapMembersWithProfile(A, profile1)); 
                setBTeam(mapMembersWithProfile(B, profile2)); 
                setCTeam(mapMembersWithProfile(C, profile3)); 
                setGeneralTeam(mapMembersWithProfile(Others, profile4));
            } else {
                alert('오늘의 팀 정보 가져오기를 실패하였습니다.')
            }
        })  
    }, [])

    const handleTeamAdd = (member) => {
        const profileImage = activeTeam === 'A' ? profile1 : activeTeam === 'B' ? profile2 : activeTeam === 'C' ? profile3 : profile4;
        const memberWithImage = { ...member, image: profileImage };

        if (activeTeam === 'A') {
            setATeam([...aTeam, memberWithImage]);
        } else if (activeTeam === 'B') {
            setBTeam([...bTeam, memberWithImage]);
        } else if (activeTeam === 'C') {
            setCTeam([...cTeam, memberWithImage]);
        } else if (activeTeam === '일반') {
            setGeneralTeam([...generalTeam, memberWithImage]);
        }
        setMembers(members.filter((m) => m !== member));
    };

    const removeFromTeam = (member, teamSetter, team) => {
        teamSetter(team.filter((m) => m !== member));
        setMembers([...members, { id: member.id, name: member.name }]);
        console.log(aIds)
    };

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

    const initDailyTeam = () => {
        Modal.confirm({
            title: '팀 초기화',
            content: (
                <div>
                    <p>정말 초기화하시겠습니까?</p>
                    <p>종료하시면 팀 구성원이 초기화됩니다.</p>
                    <p>최종 반영 또는 팀 재구성 시 사용을 권장합니다.</p>
                </div>
            ),
            okText: '진행',
            cancelText: '취소',
            onOk() {
                Axios.post('/api/record/initDailyTeam')
                .then(response => {
                    if(response.data.success) {
                        window.location.reload();
                    } else {
                        alert('팀 초기화에 실패하였습니다.')
                    }
                })
            },
            onCancel() {
                console.log('취소됨');
            },
        });
    };  

    let date = new Date();

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh", color: 'yellow' }}>
            <div style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover' }}>
                <div style={{ padding: "10px", color: 'white' }}>
                    <h1>{date.toLocaleDateString()}</h1>
                    <h1>오늘의 팀 승점기록</h1>
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
                                <div style={{ textAlign: 'center' }} onClick={() => removeFromTeam(member, setATeam, aTeam)}>
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
                            style={{ background: '#28a745', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('A팀 무승부를 반영하시겠습니까?')) {
                                    plusDrawByTeam('A');
                                    plusDrawByIds(aIds);
                                }
                            }}
                            style={{ background: '#6c757d', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('A팀 패배를 반영하시겠습니까?')) {
                                    plusLoseByTeam('A');
                                    plusLoseByIds(aIds);
                                }
                            }}
                            style={{ background: '#dc3545', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
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
                                <div style={{ textAlign: 'center' }} onClick={() => removeFromTeam(member, setBTeam, bTeam)}>
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
                            style={{ background: '#28a745', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('B팀 무승부를 반영하시겠습니까?')) {
                                    plusDrawByTeam('B');
                                    plusDrawByIds(bIds);
                                }
                            }}
                            style={{ background: '#6c757d', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('B팀 패배를 반영하시겠습니까?')) {
                                    plusLoseByTeam('B');
                                    plusLoseByIds(bIds);
                                }
                            }}
                            style={{ background: '#dc3545', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
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
                                <div style={{ textAlign: 'center' }} onClick={() => removeFromTeam(member, setCTeam, cTeam)}>
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
                            style={{ background: '#28a745', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('C팀 무승부를 반영하시겠습니까?')) {
                                    plusDrawByTeam('C');
                                    plusDrawByIds(cIds);
                                }
                            }}
                            style={{ background: '#6c757d', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                        </Button>
                        <Button 
                            type="primary"
                            onClick={() => {
                                if (window.confirm('C팀 패배를 반영하시겠습니까?')) {
                                    plusLoseByTeam('C');
                                    plusLoseByIds(cIds);
                                }
                            }}
                            style={{ background: '#dc3545', width: '90px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
                        </Button>
                    </div>
                </div>

                {/* 일반팀 */}
                <div style={{ marginBottom: '20px', border: '2px solid green', padding: '10px', borderRadius: '8px' }}>
                    <h2 style={{ color: 'white', textAlign: 'center' }}>일반</h2>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={generalTeam}
                        renderItem={(member) => (
                            <List.Item>
                                <div style={{ textAlign: 'center' }} onClick={() => removeFromTeam(member, setGeneralTeam, generalTeam)}>
                                    <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                    <p style={{ color: 'white' }}>{member.name}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={() => initDailyTeam()} style={{ background: '#2a85fb', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>팀 초기화</Button>
                </div>
            </div>

            <div style={{ backgroundImage: `url(${list})` }}>
                <div style={{ padding: "10px", color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        {['A', 'B', 'C', '일반'].map((team) => (
                            <Button
                                key={team}
                                type={activeTeam === team ? 'primary' : 'default'}
                                onClick={() => setActiveTeam(team)}
                            >
                                {team}
                            </Button>
                        ))}
                    </div>
                </div>

                <div>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={members}
                        renderItem={(member) => (
                            <List.Item>
                                <Button
                                    onClick={() => handleTeamAdd(member)}
                                    style={{ borderRadius: '3px', fontSize: '15px', padding: '0px 15px' }}
                                >
                                    {member.name}
                                </Button>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;
