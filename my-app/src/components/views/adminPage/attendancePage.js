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
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [aTeam, setATeam] = useState([]);
    const [bTeam, setBTeam] = useState([]);
    const [cTeam, setCTeam] = useState([]);
    const [generalTeam, setGeneralTeam] = useState([]);
    const [activeTeam, setActiveTeam] = useState('A');

    useEffect(() => {
        async function groupPlayers() {
            setLoading(true);
            try {
                const teamNames = [ "A", "B", "C", "Others" ];
                const teams = {}
                for (const teamName of teamNames) {
                    const team = (await Axios.get(`/api/teams/${teamName}/players`)).data;
                    teams[teamName] = team.map(player => player.id);
                }

                const allPlayers = (await Axios.get('/api/players')).data;
                const players = [...teams.A, ...teams.B, ...teams.C, ...teams.Others];
                const benchPlayers = allPlayers.filter(member => !players.includes(member.id));

                const mapMembersWithProfile = (ids, profileImage) => 
                    allPlayers.filter(member => ids.includes(member.id))
                        .map(member => ({ ...member, image: profileImage }));

                setATeam(mapMembersWithProfile(teams.A, profile1)); 
                setBTeam(mapMembersWithProfile(teams.B, profile2)); 
                setCTeam(mapMembersWithProfile(teams.C, profile3)); 
                setGeneralTeam(mapMembersWithProfile(teams.Others, profile4));
                setMembers(benchPlayers);
            } catch (err) {
                alert('오늘의 팀 정보 가져오기를 실패하였습니다.')
                throw err;
            } finally {
                setLoading(false);
            }
        }
        groupPlayers();
    }, []);

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
        setMembers([...members, { id: member.id, name: member.name }]); // Remove image when returning to member list
    };

    const initDailyTeam = () => {
        Modal.confirm({
            title: '팀 초기화',
            content: (
                <div>
                    <p>정말 초기화하시겠습니까?</p>
                    <p>종료하시면 팀 구성원이 초기화됩니다.</p>
                </div>
            ),
            okText: '확인',
            cancelText: '취소',
            async onOk() {
                setLoading(true);
                try {
                    await Axios.patch('/api/teams/players/reset');
                    window.location.reload();
                } catch (err) {
                    alert('팀 초기화에 실패하였습니다.');
                    throw err;
                } finally {
                    setLoading(false);
                }
            },
            onCancel() {
                console.log('취소됨');
            },
        });
    };

    const submitAttendanceList = () => {
        Modal.confirm({
            title: '명단 제출',
            content: (
                <div>
                    <p>A팀 인원: {aTeam.length}명</p>
                    <p>B팀 인원: {bTeam.length}명</p>
                    <p>C팀 인원: {cTeam.length}명</p>
                    <p>일반 인원: {generalTeam.length}명</p>
                    <p>정말 등록하시겠습니까?</p>
                    <p>수정 후 재등록도 가능합니다.</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            async onOk() {
                console.log('출석 명단 제출:', { A: aTeam, B: bTeam, C: cTeam, 일반: generalTeam });
                setLoading(true);
                try {
                    await Axios.patch('/api/teams/players', {
                        teams: {
                            A: aTeam.map(member => member.id),
                            B: bTeam.map(member => member.id),
                            C: cTeam.map(member => member.id),
                            Others: generalTeam.map(member => member.id),
                        }
                    });
                    console.log('명단 등록에 성공하였습니다.'); 
                } catch (err) {
                    alert('명단 등록에 실패하였습니다.');
                    throw err;
                } finally {
                    setLoading(false);
                }
            },
            onCancel() {
                console.log('취소됨');
            },
        });
    };

    let date = new Date();

    if (loading) return <p>⏳ loading...</p>;

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh" }}>
            <div style={{ backgroundImage: `url(${list})` }}>
                <div style={{ padding: "10px", color: 'white' }}>
                    <h1>🔴 팀 나누기 🔵</h1>
                    <p> {date.toLocaleDateString()} </p>
                    <p>💡 A, B, C, 일반 팀을 선택하고 회원을 추가하세요.</p>
                    <p>💡 일반팀은 후반 2시간 참여인원으로 출석처리만 반영됩니다.</p>
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

            <div style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover', position: 'relative', overflow: 'hidden' }}>
                {['A', 'B', 'C', '일반'].map((team) => (
                    <div key={team} style={{ marginBottom: '20px' }}>
                        <h2 style={{ color: 'white' }}>{team}</h2>
                        <List
                            grid={{ gutter: 10, column: 5 }}
                            dataSource={team === 'A' ? aTeam : team === 'B' ? bTeam : team === 'C' ? cTeam : generalTeam}
                            renderItem={(member) => (
                                <List.Item>
                                    <div style={{ textAlign: 'center' }} onClick={() => removeFromTeam(member, team === 'A' ? setATeam : team === 'B' ? setBTeam : team === 'C' ? setCTeam : setGeneralTeam, team === 'A' ? aTeam : team === 'B' ? bTeam : team === 'C' ? cTeam : generalTeam)}>
                                        <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                        <p style={{ color: 'white' }}>{member.name}</p>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                ))}
                <div style={{ marginTop: '70px' }}>
                    <Button type="primary" onClick={() => initDailyTeam()} style={{ background: '#d9363e', width: '120px', height: '50px', borderRadius: '6px', fontSize: '16px', position: 'absolute', bottom: '1%', left: '4%' }}>초기화</Button>
                    <Button type="primary" onClick={submitAttendanceList} style={{ background: '#2a85fb', width: '120px', height: '50px', borderRadius: '6px', fontSize: '16px', position: 'absolute', bottom: '1%', right: '4%'  }}>저장</Button>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;
