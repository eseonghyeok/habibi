import React, { useState, useEffect, useMemo } from 'react';
import Axios from 'axios';
import { Button, List, Modal, Radio } from 'antd';
import Table from "../recordPage/default/defaultGroupingTable";
import groundJpg from '../../images/ground.png';
import list from '../../images/playerlist.jpg';
import profile4 from '../../images/profile/4.jpg';
import background from '../../images/backgroud.jpg';

function GroupingPage() {
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

    const [step, setStep] = useState(1);
    const [members, setMembers] = useState(all);
    const [players, setPlayers] = useState([]);
    const [polls, setPolls] = useState([]);
    const [yearPts, setYearPts] = useState([]);
    const [teamCount, setTeamCount] = useState(3);

    useEffect(() => {
        Axios.get('/api/record/getDailyTeam').then(response => {
            if (response.data.success) {
                const { Players } = response.data.dailyTeam;
                const players = [...Players];
                const notPlayers = all.filter(member => !players.includes(member.id));
                const mapMembersWithProfile = (ids, profileImage) =>
                    all.filter(member => ids.includes(member.id))
                        .map(member => ({ ...member, image: profileImage }));

                setPlayers(mapMembersWithProfile(players, profile4));
                setMembers(notPlayers);
            }
        });
        Axios.get('/api/record/getDaily').then(response => {
            if (response.data.success) {
                setPolls(response.data.dailyChart.players);
            } else {
                alert('일간차트 가져오기를 실패하였습니다.')
            }
        });
        Axios.get('/api/record/getYear')
        .then(response => {
            if(response.data.success) {
                setYearPts(response.data.yearChart.players)
            } else {
                alert('연간차트 가져오기를 실패하였습니다.')
            }
        })
    }, []);

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
            content: <>정말 초기화하시겠습니까?</>,
            onOk() {
                Axios.post('/api/record/initPlayers').then(response => {
                    if (response.data.success) window.location.reload();
                });
            }
        });
    };

    const submitPlayers = () => {
        Modal.confirm({
            title: '투표자 명단 제출',
            content: (
                <>
                    <p>투표 인원: {players.length}명</p>
                    <p>정말 등록하시겠습니까?</p>
                </>
            ),
            okText: '등록',
            cancelText: '취소',
            onOk() {
                Axios.post('/api/record/submitPlayers', {
                    Players: players.map(member => member.id)
                }).then(response => {
                    if (!response.data.success) {
                        alert('명단 등록에 실패하였습니다.');
                    } else {
                        console.log('명단 등록에 성공하였습니다.');
                        window.location.reload();
                    }
                });
            }
        });
    };

    const handleTeamChange = e => {
        setTeamCount(e.target.value);
        console.log('선택된 팀 수:', e.target.value);
    };

    const columns = useMemo(() => [
        { accessor: "rank", Header: "RANK" },
        { accessor: "name", Header: "NAME" },
        { accessor: "plays", Header: "P" },
        { accessor: "pts", Header: "PTS" },
        { accessor: "avgPts", Header: "AVG PTS" },
    ], []);

    const filteredData = polls.filter(p => p.poll > 0).sort((a, b) => b.pts - a.pts);
    const filteredIds = filteredData.map(p => p.id);
    const filteredYearData = filteredIds.map(id => yearPts[id]);
    const dataWithAvg = filteredYearData.map(player => ({
        ...player,
        avgPts: player.plays > 0 ? +(player.pts / player.plays).toFixed(2) : 0,
    }));

    let playerRank = 0;
    const indexedData = dataWithAvg
        .sort((a, b) => b.avgPts - a.avgPts)
        .map((item, index, array) => {
            if (index > 0 && item.avgPts === array[index - 1].avgPts) {
                return { ...item, rank: playerRank };
            } else {
                playerRank++;
                return { ...item, rank: playerRank };
            }
        });

    const date = new Date();

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh", padding: '20px', backgroundImage: `url(${background})` }}>
            <h1>🎯 Step {step}</h1>

            {step === 1 && (
                <>
                    <div style={{ backgroundImage: `url(${list})` }}>
                        <div style={{ padding: "10px", color: 'white' }}>
                            <h2>🎲 랜덤 팀 짜기</h2>
                            <p>{date.toLocaleDateString()}</p>
                            <p>💡 메인 경기에 참석하는 회원들을 선택하세요.</p>
                        </div>
                        <List
                            grid={{ gutter: 10, column: 5 }}
                            dataSource={members}
                            renderItem={(member) => (
                                <List.Item>
                                    <Button onClick={() => addPlayers(member)}>
                                        {member.name}
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </div>

                    <div style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover' }}>
                        <h2 style={{ color: 'white' }}>투표자</h2>
                        <List
                            grid={{ gutter: 10, column: 5 }}
                            dataSource={players}
                            renderItem={(member) => (
                                <List.Item>
                                    <div onClick={() => removePlayers(member)} style={{ textAlign: 'center' }}>
                                        <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                        <p style={{ color: 'white' }}>{member.name}</p>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={initPlayers} danger style={{ marginRight: '10px' }}>초기화</Button>
                            <Button type="primary" onClick={submitPlayers}>저장</Button>
                        </div>
                        <p style={{ color: 'white' }}>💡 투표자 명단을 우선 저장한 후</p>
                        <p style={{ color: 'white' }}>💡 총 몇 팀으로 나누어야 하는지 선택하세요.</p>
                        <Radio.Group
                            onChange={handleTeamChange}
                            value={teamCount}
                            optionType="button"
                            buttonStyle="solid"
                            style={{ marginBottom: '1rem' }}
                        >
                            <Radio.Button value={2}>2팀</Radio.Button>
                            <Radio.Button value={3}>3팀</Radio.Button>
                        </Radio.Group>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={() => setStep(2)}>다음</Button>
                        </div>
                    </div>
                </>
            )}

            {step === 2 && (
                <div>
                    <h2>📊 일간 차트</h2>
                    <Table columns={columns} data={indexedData} teamCount={teamCount}/>
                    <div style={{ marginTop: '20px' }}>
                        <Button onClick={() => setStep(1)}>이전</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GroupingPage;
