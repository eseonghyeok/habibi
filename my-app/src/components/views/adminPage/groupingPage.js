import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import groundJpg from '../../images/ground.png';
import list from '../../images/playerlist.jpg';
import profile1 from '../../images/profile/1.jpg';
import profile2 from '../../images/profile/2.jpg';
import profile3 from '../../images/profile/3.jpg';
import profile4 from '../../images/profile/4.jpg';

function AttendancePage() {
    const all = [
        { id: 0, name: "김형철" }, { id: 1, name: "송효석" }, { id: 2, name: "박재범" }, { id: 3, name: "권위준" }, { id: 4, name: "신종은" },
        { id: 5, name: "이정일" }, { id: 6, name: "조돈휘" }, { id: 7, name: "현종권" }, { id: 8, name: "곽영래" }, { id: 9, name: "정회화" },
        { id: 10, name: "김상명" }, { id: 11, name: "신종윤" }, { id: 12, name: "황성진" }, { id: 13, name: "이병철" },
        { id: 14, name: "강동균" }, { id: 15, name: "류희대" }, { id: 16, name: "여성진" }, { id: 17, name: "김영준" }, { id: 18, name: "장효준" },
        { id: 19, name: "정기택" }, { id: 20, name: "김정민" }, { id: 21, name: "정현준" }, { id: 22, name: "김주환" }, { id: 23, name: "이지철" }, 
        { id: 24, name: "김진호" }, { id: 25, name: "박진산" }, { id: 26, name: "임다훈" }, { id: 27, name: "강병준" }, { id: 28, name: "박찬용" },
        { id: 29, name: "이종범" }, { id: 30, name: "박기환" }, { id: 31, name: "이주은" }, { id: 32, name: "권현택" },
        { id: 33, name: "이성혁" }, { id: 34, name: "이상욱" }, { id: 35, name: "박준영" },
        { id: 36, name: "윤한중" }, { id: 37, name: "전지민" }, { id: 38, name: "권순국" }, { id: 39, name: "조대인" }
    ];

    const [members, setMembers] = useState(all);
    const [players, setPlayers] = useState([]);

    useEffect(() => { 
        Axios.get('/api/record/getDailyTeam')
        .then(response => {
            console.log(response.data)
            if(response.data.success) {
                const { Players } = response.data.dailyTeam;
                const players = [...Players];
                const notPlayers = all.filter(member => !players.includes(member.id));
                const mapMembersWithProfile = (ids, profileImage) => 
                    all.filter(member => ids.includes(member.id))
                        .map(member => ({ ...member, image: profileImage }));

                setPlayers(mapMembersWithProfile(players, profile4));
                setMembers(notPlayers);
            } else {
                alert('오늘의 팀 정보 가져오기를 실패하였습니다.')
            }
        })  
    }, [])

    const addPlayers = (member) => {
        setPlayers([...players, { ...member, image: profile4 }]);
        setMembers(members.filter((m) => m !== member));
    };

    const removePlayers = (member) => {
        setMembers([...members, { id: member.id, name: member.name }]);
        setPlayers(players.filter(m => m.id !== member.id));
    };

    const initPlayers = () => {
        Modal.confirm({
            title: '투표자 명단 초기화',
            content: (
                <div>
                    <p>정말 초기화하시겠습니까?</p>
                    <p>종료하시면 명단이 초기화됩니다.</p>
                </div>
            ),
            okText: '확인',
            cancelText: '취소',
            onOk() {
                Axios.post('/api/record/initPlayers')
                .then(response => {
                    if(response.data.success) {
                        window.location.reload();
                    } else {
                        alert('명단 초기화에 실패하였습니다.')
                    }
                })
            },
            onCancel() {
                console.log('취소됨');
            },
        });
    };

    const submitPalyers = () => {
        Modal.confirm({
            title: '투표자 명단 제출',
            content: (
                <div>
                    <p>A팀 인원: {players.length}명</p>
                    <p>정말 등록하시겠습니까?</p>
                    <p>수정 후 재등록도 가능합니다.</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            onOk() {
                console.log('투표자 명단 제출:', { players: players });
                Axios.post('/api/record/submitPlayers', {
                    Players: players.map(member => member.id)
                })
                .then(response => {
                    if (response.data.success) {
                        console.log('명단 등록에 성공하였습니다.'); 
                    } else {
                        alert('명단 등록에 실패하였습니다.');
                    }
                });
            },
            onCancel() {
                console.log('취소됨');
            },
        });
    };

    let date = new Date();

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh" }}>
            <div style={{ backgroundImage: `url(${list})` }}>
                <div style={{ padding: "10px", color: 'white' }}>
                    <h1>🎲랜덤 팀 짜기🎲</h1>
                    <p> {date.toLocaleDateString()} </p>
                    <p>💡 기록을 측정하는 메인 경기에 참석하는 회원들을 모두 선택하세요.</p>
                </div>
                <div>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={members}
                        renderItem={(member) => (
                            <List.Item>
                                <Button
                                    onClick={() => addPlayers(member)}
                                    style={{ borderRadius: '3px', fontSize: '15px', padding: '0px 15px' }}
                                >
                                    {member.name}
                                </Button>
                            </List.Item>
                        )}
                    />
                </div>
            </div>

            <div style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover', position: 'relative', overflow: 'hidden' }}>
                <h2 style={{ color: 'white' }}>투표자</h2>
                <List
                    grid={{ gutter: 10, column: 5 }}
                    dataSource={players}
                    renderItem={(member) => (
                        <List.Item>
                            <div style={{ textAlign: 'center' }} onClick={() => removePlayers(member)}>
                                <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                <p style={{ color: 'white' }}>{member.name}</p>
                            </div>
                        </List.Item>
                    )}
                />
                <div style={{ marginTop: '70px' }}>
                    <Button type="primary" onClick={initPlayers} style={{ background: '#d9363e', width: '120px', height: '50px', borderRadius: '6px', fontSize: '16px', position: 'absolute', bottom: '1%', left: '4%' }}>초기화</Button>
                    <Button type="primary" onClick={submitPalyers} style={{ background: '#2a85fb', width: '120px', height: '50px', borderRadius: '6px', fontSize: '16px', position: 'absolute', bottom: '1%', right: '4%'  }}>저장</Button>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;
