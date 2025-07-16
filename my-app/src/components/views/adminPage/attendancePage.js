import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import groundJpg from '../../images/ground.png';
import list from '../../images/playerlist.jpg';

import profile1 from '../../images/profile/1.jpg';
import profile2 from '../../images/profile/2.jpg';
import profile3 from '../../images/profile/3.jpg';
import profile4 from '../../images/profile/4.jpg';
const profiles = [profile1, profile2, profile3, profile4];

const TEAM_NAMES = ['A', 'B', 'C', 'Others'];
const TEAM_ALIAS = ['A', 'B', 'C', '일반'];

function AttendancePage() {
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState({});
    const [activeTeam, setActiveTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const checkSubmit = useRef(false);

    useEffect(() => {
        async function groupPlayers() {
            setLoading(true);
            try {
                checkSubmit.current = ((await Axios.get('/api/teams')).data.length) ? true : false;
                const teamsTemp = {}
                for (const index in TEAM_NAMES) {
                    teamsTemp[TEAM_NAMES[index]] = {
                        alias: TEAM_ALIAS[index],
                        image: profiles[index],
                        members: (await Axios.get(`/api/teams/name/${TEAM_NAMES[index]}/players`)).data
                    };
                }

                setTeams(teamsTemp);
                setActiveTeam(Object.keys(teamsTemp)[0]);
                setMembers((await Axios.get('/api/players')).data);
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
        const teamsTemp = structuredClone(teams);
        teamsTemp[activeTeam].members.push(member);
        setTeams(teamsTemp);
        setMembers(members.filter((m) => m !== member));
    };

    const removeFromTeam = (member, name) => {
        const teamsTemp = structuredClone(teams);
        teamsTemp[name].members = teams[name].members.filter((m) => m !== member);
        setTeams(teamsTemp);
        setMembers([...members, member]);
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
                    await Axios.delete('/api/teams');
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
                    {Object.values(teams).map(v => <p key={v}>{v.alias}팀 인원: {v.members.length}명</p>)}
                    <p>정말 등록하시겠습니까?</p>
                    <p>수정 후 재등록도 가능합니다.</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            async onOk() {
                setLoading(true);
                try {
                    if (checkSubmit.current) {
                        await Axios.patch('/api/teams', { teams });
                    } else {
                        await Axios.post('/api/teams', { teams });
                    }
                    console.log('명단 등록에 성공하였습니다.');
                    window.location.reload();
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
                    <p>💡 {Object.values(teams).map(v => v.alias).join(', ')} 팀을 선택하고 회원을 추가하세요.</p>
                    <p>💡 {Object.values(teams).at(-1).alias}팀은 후반 2시간 참여인원으로 출석처리만 반영됩니다.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        {Object.keys(teams).map(name => (
                            <Button
                                key={name}
                                type={activeTeam === name ? 'primary' : 'default'}
                                onClick={() => setActiveTeam(name)}
                            >
                                {teams[name].alias}
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
                {Object.keys(teams).map(name => (
                    <div key={name} style={{ marginBottom: '20px' }}>
                        <h2 style={{ color: 'white' }}>{teams[name].alias}</h2>
                        <List
                            grid={{ gutter: 10, column: 5 }}
                            dataSource={teams[name].members}
                            renderItem={(member) => (
                                <List.Item>
                                    <div style={{ textAlign: 'center' }} onClick={() => removeFromTeam(member, name)}>
                                        <img src={teams[name].image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
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
