import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import dayjs from 'dayjs';
import groundJpg from '../../../images/ground.png';
import captureAndShare from "../../adminPage/ShareResult";

import profile1 from '../../../images/profile/1.jpg';
import profile2 from '../../../images/profile/2.jpg';
import profile3 from '../../../images/profile/3.jpg';
const profiles = [profile1, profile2, profile3];

function DailyTeamPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [record, setRecord] = useState({});
    const match = useRef(1);
    const now = dayjs().format('YYYY-MM-DD');

    useEffect(() => { 
        async function getPlayers() {
            setLoading(true);
            try {
                const teamsData = (await Axios.get('/api/teams')).data;
                if (teamsData.length === 0) {
                    alert('팀 나누기 이후에 진행하세요.');
                    navigate('/attendance');
                    return;
                }

                const teamsTemp = {}
                const recordTemp = {}
                for (const team of teamsData) {
                    if (team.metadata.index !== null) {
                        teamsTemp[team.name] = {
                            image: profiles[team.metadata.index],
                            players: (await Axios.get(`/api/teams/name/${team.name}/players`)).data
                        }
                        recordTemp[team.name] = {
                          win: 0,
                          draw: 0,
                          lose: 0
                        }
                    }
                }

                const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
                for (const log of Object.values(recordData.metadata.log)) {
                    for (const name of Object.keys(log)) {
                        recordTemp[name][log[name].type]++;
                    }
                    match.current++;
                }

                setTeams(teamsTemp);
                setRecord(recordTemp);
            } catch (err) {
                alert('오늘의 팀 정보 가져오기를 실패하였습니다.')
                throw err;
            } finally {
                setLoading(false);
            }
        }
        getPlayers();
    }, [navigate, now]);

    const setLog = async (name, type) => {
        const secondTeamType = (type === 'win') ? 'lose' : (type === 'draw') ? 'draw' : 'win';
        Modal.info({
            title: `${(type === 'win') ? '패배' : (type === 'draw') ? '무승부' : '승리'}한 팀을 선택해 주세요.`,
            content: (
                <div>
                    {Object.keys(teams).filter(secondTeamName => secondTeamName !== name).map(secondTeamName => 
                        <Button
                            key={secondTeamName}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await Axios.patch(`/api/records/date/${now}/log`, {
                                        match: match.current,
                                        log: {
                                            [name]: {
                                                type,
                                                players: teams[name].players.map(player => player.id)
                                            },
                                            [secondTeamName]: {
                                                type: secondTeamType,
                                                players: teams[secondTeamName].players.map(player => player.id)
                                            },
                                        }
                                    });

                                    match.current++;
                                    const recordTemp = structuredClone(record);
                                    recordTemp[name][type]++;
                                    recordTemp[secondTeamName][secondTeamType]++;
                                    setRecord(recordTemp);
                                    Modal.destroyAll();
                                } catch (err) {
                                    alert('결과 반영에 실패하였습니다.');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            icon={<img src={teams[secondTeamName].image} alt={secondTeamName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                            style={{background: 'transparent', border: 'none', padding: 0}}
                        >
                            {secondTeamName}
                        </Button>
                    )}
                </div>
            ),
            okText: '취소'
        });
    };

    const deleteRecord = async () => {
        setLoading(true);
        try {
            if (match.current === 1) {
                alert('기록이 존재하지 않습니다.');
                setLoading(false);
                return;
            }

            const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
            const lastRecord = recordData.metadata.log[match.current - 1];
            Modal.confirm({
                title: '최근 기록 삭제',
                content: (
                    <div>
                        {Object.keys(lastRecord).map(name => 
                            <p key={name}>{name}팀 {(lastRecord[name].type === 'win') ? '승리' : (lastRecord[name].type === 'draw') ? '무승부' : '패배'}</p>
                        )}
                        <p>기록을 삭제하시겠습니까?</p>
                    </div>
                ),
                okText: '삭제',
                cancelText: '취소',
                async onOk() {
                    try {
                        await Axios.patch(`/api/records/date/${now}/log/delete`, {
                            match: match.current - 1
                        });

                        match.current--;
                        const recordTemp = structuredClone(record);
                        for (const name of Object.keys(lastRecord)) {
                            recordTemp[name][lastRecord[name].type]--;
                        }
                        setRecord(recordTemp);
                    } catch (err) {
                        alert('결과 반영에 실패하였습니다.');
                    } finally {
                        setLoading(false);
                    }
                },
                onCancel() {
                    setLoading(false);
                }
            });
        } catch (err) {
            alert('결과 반영에 실패하였습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    let date = new Date();
    let recordRef = useRef(null);

    if (loading) return <p>⏳ loading...</p>;

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh", color: 'yellow' }}>
            <div ref={recordRef} style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover' }}>
                <div style={{ padding: "10px", color: 'white' }}>
                    <h1 style={{ fontSize: '27px', marginTop: '37px'}}>⚽ 오늘의 팀 승점기록 ⚽</h1>
                    <p>{date.toLocaleDateString()}</p>
                    <p>💡 각 팀의 경기 결과를 기록하여 승점을 부여합니다.</p>
                    <p>💡 승리:3점 / 무승무: 1점 / 패배: 0점</p>
                </div>

                {Object.keys(teams).map(name => (
                    <div key={name} style={{ marginBottom: '20px', border: '2px solid white', padding: '10px', borderRadius: '8px', position: 'relative', overflow: 'hidden', minHeight: '330px' }}>
                        <h2 style={{ color: 'white', textAlign: 'center' }}>{name}팀</h2>
                        <List
                            grid={{ gutter: 10, column: 5 }}
                            dataSource={teams[name].players}
                            renderItem={(member) => (
                                <List.Item>
                                    <div style={{ textAlign: 'center' }}>
                                        <img src={teams[name].image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
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
                            <p style={{ margin: '5px 0' }}>승: <strong>{record[name].win}</strong></p>
                            <p style={{ margin: '5px 0' }}>무: <strong>{record[name].draw}</strong></p>
                            <p style={{ margin: '5px 0' }}>패: <strong>{record[name].lose}</strong></p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px', position: 'absolute', bottom: '2%', left: '4%' }}>
                            <Button
                                type="primary"
                                onClick={() => setLog(name, "win")} 
                                style={{ background: '#28a745', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>승
                            </Button>
                            <Button 
                                type="primary"
                                onClick={() => setLog(name, "draw")} 
                                style={{ background: '#6c757d', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>무
                            </Button>
                            <Button 
                                type="primary"
                                onClick={() => setLog(name, "lose")} 
                                style={{ background: '#dc3545', width: '65px', height: '40px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>패
                            </Button>
                        </div>
                    </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button type="primary" onClick={() => deleteRecord()} style={{ background: '#dc3545', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>최근기록삭제✖️</Button>
                    <Button type="primary" onClick={() => captureAndShare(recordRef)} style={{ background: '#30d946', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>결과공유✨</Button>
                </div>
            </div>
        </div>
    );
}

export default DailyTeamPage;
