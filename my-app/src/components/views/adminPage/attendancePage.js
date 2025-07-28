import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { playerInfo } from '../../utils';
import groundJpg from '../../images/ground.png';
import list from '../../images/playerlist.jpg';

import profile1 from '../../images/profile/1.jpg';
import profile2 from '../../images/profile/2.jpg';
import profile3 from '../../images/profile/3.jpg';
import profile4 from '../../images/profile/4.jpg';
import axios from 'axios';

function AttendancePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState({});
    const [activeTeam, setActiveTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const profiles = useRef([]);
    const now = dayjs().format('YYYY-MM-DD');

    useEffect(() => {
        async function getPlayers() {
            setLoading(true);
            try {
                const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
                if (recordData && (Object.keys(recordData.result).length > 0)) {
                    alert('이미 오늘 경기를 종료하였습니다.');
                    navigate('/record/day');
                    return;
                }

                const teamsData = (await Axios.get('/api/teams')).data;
                const teamsTemp = {}
                for (const team of teamsData) {
                    teamsTemp[team.name] = {
                        image: team.metadata.image,
                        members: (await Axios.get(`/api/teams/name/${team.name}/players`)).data
                    }
                }

                profiles.current = [profile1, profile2, profile3, profile4].map(image => {
                    const team = teamsData.find(team => team.metadata.image === image);
                    return {
                        name: team ? team.name : '',
                        image
                    }
                });

                setTeams(teamsTemp);
                setActiveTeam(Object.keys(teamsTemp)[0]);
                setMembers((await Axios.get('/api/players')).data.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (err) {
                alert('오늘의 팀 정보 가져오기를 실패하였습니다.');
                throw err;
            } finally {
                setLoading(false);
            }
        }
        getPlayers();
    }, [navigate, now]);

    const setTeamName = async (profile) => {
        try {
            const newName = window.prompt('팀 이름을 10자 이하의 영문으로 입력해주세요.');
            if ((newName === null) || (newName.trim() === '')) {
                return;
            } else if (!(/^[A-Za-z]{1,10}$/.test(newName))) {
                alert('10자 이하의 영문자만 입력 가능합니다.');
                return;
            } else if (Object.keys(teams).includes(newName)) {
                alert('이미 존재하는 팀 이름입니다.');
                return;
            }

            if (profile.name) await axios.delete(`/api/teams/name/${profile.name}`);
            await axios.post(`/api/teams/name/${newName}`, {
                image: profile.image
            });

            window.location.reload();
        } catch (err) {
            alert('팀 수정에 실패하였습니다.');
            throw err;
        }
    }

    const setTeamNames = () => {
        for (const team of Object.values(teams)) {
            if (team.members.length > 0) {
                alert('팀 초기화하고 진행해주세요.');
                return;
            }
        }

        Modal.info({
            title: '팀 수정',
            content: (
                <div>
                    <p>수정할 팀을 골라주세요.</p>
                    <br />
                    {profiles.current.map(profile => 
                        <div key={profile.image}>
                            <img src={profile.image} alt={profile.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            <span style={{ fontWeight: 'bold' }}>{profile.name}</span>
                            <div>
                                <Button
                                    style={{ background: profile.name ? '#6c757d' : '#28a745' }}
                                    onClick={() => setTeamName(profile)}
                                >
                                    { profile.name ? '수정' : '추가' }
                                </Button>
                                <Button
                                    style={{ marginLeft: '20px', background: '#dc3545' }}
                                    onClick={async () => {
                                        try {
                                            await axios.delete(`/api/teams/name/${profile.name}`)
                                            window.location.reload();
                                        } catch (err) {
                                            alert('팀 삭제에 실패하였습니다.');
                                            throw err;
                                        }
                                    }}
                                >
                                    삭제
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ),
            okText: '취소'
        });
    }

    const handleTeamAdd = (member) => {
        Modal.confirm({
            title: '선수 등록',
            content: (
                <div>
                    {playerInfo(member)}
                    <br />
                    <p><span style={{ fontWeight: 'bolder' }}>{activeTeam}</span>팀에 선수를 등록하겠습니까?</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            onOk() {
                const teamsTemp = structuredClone(teams);
                teamsTemp[activeTeam].members.push(member);
                setTeams(teamsTemp);
                setMembers(members.filter((m) => m !== member).sort((a, b) => a.name.localeCompare(b.name)));
            }
        });
    };

    const removeFromTeam = (member, name) => {
        Modal.confirm({
            title: '선수 제외',
            content: (
                <div>
                    <p><span style={{ fontWeight: 'bolder' }}>{activeTeam}</span>팀에서 <span style={{ fontWeight: 'bolder' }}>{member.name}</span>선수를 제외하겠습니까?</p>
                    {playerInfo(member)}
                </div>
            ),
            okText: '제외',
            cancelText: '취소',
            onOk() {
                const teamsTemp = structuredClone(teams);
                teamsTemp[name].members = teams[name].members.filter((m) => m !== member);
                setTeams(teamsTemp);
                setMembers([...members, member].sort((a, b) => a.name.localeCompare(b.name)));
            }
        });
    };

    const initDailyTeam = async () => {
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
                try {
                    const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
                    if (recordData && (Object.keys(recordData.result).length === 0)) {
                        await Axios.delete(`/api/records/date/${now}`);
                    }
                    await Axios.patch('/api/teams/reset');
                    window.location.reload();
                } catch (err) {
                    alert('팀 초기화에 실패하였습니다.');
                    throw err;
                }
            }
        });
    };

    const submitAttendanceList = () => {
        Modal.confirm({
            title: '명단 제출',
            content: (
                <div>
                    {Object.keys(teams).map(name => 
                        <p key={name}>{name}팀 인원: {teams[name].members.length}명</p>
                    )}
                    <p>정말 등록하시겠습니까?</p>
                    <p>수정 후 재등록도 가능합니다.</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            async onOk() {
                try {
                    const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
                    if (!recordData) {
                        await Axios.post(`/api/records/date/${now}`);
                    }
                    await Axios.patch('/api/teams', { teams });
                    window.location.reload();
                } catch (err) {
                    alert('명단 등록에 실패하였습니다.');
                    throw err;
                }
            }
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
                    <p>💡 {Object.keys(teams).join(', ')} 팀을 선택하고 회원을 추가하세요.</p>
                    <div style={{ display: 'flex', overflowX: 'auto', justifyContent: 'center', gap: '10px', marginBottom: '20px', padding: '10px 0' }}>
                        {Object.keys(teams).map(name => (
                            <Button
                                key={name}
                                type={activeTeam === name ? 'primary' : 'default'}
                                onClick={() => setActiveTeam(name)}
                            >
                                {name}
                            </Button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Button 
                            icon={<SettingOutlined />}
                            onClick={() => setTeamNames()}
                        >
                            팀 설정
                        </Button>
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
                        <h2 style={{ color: 'white' }}>{name}</h2>
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
