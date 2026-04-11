import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button, List, Modal, Select } from 'antd';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { playerInfo, getPlayerInfo } from '../../utils';
import groundJpg from '../../images/ground.png';
import list from '../../images/playerlist.jpg';
import captureAndShare from "../adminPage/ShareResult";

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
        if (!recordData && (localStorage.getItem('isLoggedIn') !== 'true')) {
          alert('오늘의 경기 명단이 존재하지 않습니다.');
          navigate('/');
          return;
        }

        let playerNum = 0;
        const teamsData = (await Axios.get('/api/teams')).data;
        const teamsTemp = {}
        for (const team of teamsData) {
          teamsTemp[team.name] = {
            image: team.metadata.image,
            members: (await Axios.get(`/api/teams/name/${team.name}/players`)).data
          }
          playerNum += teamsTemp[team.name].members.length;
        }

        profiles.current = [profile1, profile2, profile3, profile4].map(image => {
          const team = teamsData.find(team => team.metadata.image === image);
          return {
            name: team ? team.name : '',
            image
          }
        });

        if ((playerNum === 0) && recordData) {
          if (Object.keys(recordData.metadata.teams).length > 0) {
            await Axios.patch('/api/teams', {
              teams: recordData.metadata.teams
            });
            window.location.reload();
          }
        }

        setTeams(teamsTemp);
        setActiveTeam(Object.keys(teamsTemp)[0]);
        setMembers((await Axios.get('/api/players')).data.filter(player => !player.teamName).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        alert('오늘의 팀 정보 가져오기를 실패하였습니다.');
        window.location.reload();
        throw err;
      } finally {
        setLoading(false);
      }
    }
    getPlayers();
  }, [navigate, now]);

  const setTeamName = async (profile) => {
    try {
      const newName = prompt('팀 이름을 10자 이하의 영문으로 입력해주세요.');
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
      window.location.reload();
      throw err;
    }
  }

  const relocationTeam = async () => {
    let selectedValue = 'record';

    Modal.confirm({
      title: '팀 섞기',
      content: (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Object.keys(teams).length}, minmax(0,1fr))`,
              gap: 12,
            }}
          >
            {Object.keys(teams).map(name =>
              <p>
                {teams[name].members.map(member =>
                  <div>{member.name}</div>
                )}
              </p>
            )}
          </div>
          <br />
          <Select
            style={{ width: "100%", marginTop: 8 }}
            defaultValue='기록 기준'
            onChange={(value) => {
              selectedValue = value;
            }}
          >            
            <Select.Option value="record">기록 기준</Select.Option>
            <Select.Option value="tier">티어 기준</Select.Option>
            <Select.Option value="radnom">무작위</Select.Option>
          </Select>
          <p>팀을 기준에 맞게 섞으시겠습니까?</p>
        </div>
      ),
      okText: '섞기',
      cancelText: '취소',
      async onOk() {
        try {
          const teamsTemp = structuredClone(teams);
          const teamNames = Object.keys(teams);
          const teamMembers = [];
          for (const name of teamNames) {
            teamMembers.push(...teams[name].members);
            teamsTemp[name].members = [];
          }

          switch (selectedValue) {
            case "record": {
              for (let i = teamNames.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [teamNames[i], teamNames[j]] = [teamNames[j], teamNames[i]];
              }

              const teamRecords = [];
              for (const teamName of teamNames) {
                teamRecords.push({
                  teamName,
                  members: [],
                  matches: 0,
                  pts: 0,
                  avg: 0
                });
              }

              const standardRecordData = (await Axios.get(`/api/records/standard`)).data;
              teamMembers.forEach(member => {
                member.standardRecord = standardRecordData[member.id];
              });
              teamMembers.sort((a, b) => b.standardRecord.matches - a.standardRecord.matches || b.standardRecord.pts - a.standardRecord.pts);

              const logLines = [];
              logLines.push({ type: 'title', text: '[1] 전체 선수 정렬 (경기수↓ → pts↓)' });
              teamMembers.forEach((m, i) => {
                const r = m.standardRecord;
                logLines.push({ type: 'row', text: `${i + 1}. ${m.name} | P:${r.matches} PTS:${r.pts} AVG:${r.avg?.toFixed(2)}` });
              });

              let round = 1;
              while (teamMembers.length > 0) {
                const teamMembersTemp = teamMembers.splice(0, teamNames.length).sort((a, b) => a.standardRecord.avg - b.standardRecord.avg);
                logLines.push({ type: 'title', text: `[${round}번] 팀 순서: ${teamRecords.map(t => `${t.teamName}(${t.avg.toFixed(2)})`).join(' > ')}` });
                for (let i = 0; i < teamMembersTemp.length; i++) {
                  teamRecords[i].members.push(teamMembersTemp[i]);
                  teamRecords[i].matches += teamMembersTemp[i].standardRecord.matches;
                  teamRecords[i].pts += teamMembersTemp[i].standardRecord.pts;
                  teamRecords[i].avg = teamRecords[i].matches ? teamRecords[i].pts / teamRecords[i].matches : 0;
                  logLines.push({ type: 'row', text: `${teamMembersTemp[i].name}(AVG:${teamMembersTemp[i].standardRecord.avg?.toFixed(2)}) → ${teamRecords[i].teamName}` });
                }
                teamRecords.sort((a, b) => b.avg - a.avg);
                round++;
              }

              logLines.push({ type: 'title', text: '[최종] 팀 구성' });
              for (const teamRecord of teamRecords) {
                teamsTemp[teamRecord.teamName].members = teamRecord.members;
                logLines.push({ type: 'row', text: `${teamRecord.teamName}(AVG:${teamRecord.avg.toFixed(2)}): ${teamRecord.members.map(m => m.name).join(', ')}` });
              }

              Modal.info({
                title: '기록 기준 팀 편성 과정',
                content: (
                  <div style={{ maxHeight: '60vh', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px' }}>
                    {logLines.map((line, i) => (
                      <p key={i} style={{ margin: line.type === 'title' ? '12px 0 4px' : '2px 0', fontWeight: line.type === 'title' ? 'bold' : 'normal' }}>
                        {line.text}
                      </p>
                    ))}
                  </div>
                ),
                okText: '확인'
              });

              break;
            }
            case "tier":
              let maxNum = 0;
              for (const name of teamNames) {
                maxNum = Math.max(maxNum, teams[name].members.length);
                teamsTemp[name].members = [];
              }

              const teamValues = Object.values(teams);
              for (let i = 0; i < maxNum; i++) {
                for (let j = teamValues.length - 1; j > 0; j--) {
                  const k = Math.floor(Math.random() * (j + 1));
                  [teamValues[j], teamValues[k]] = [teamValues[k], teamValues[j]];
                }

                for (const j in teamValues) {
                  if (teamValues[j].members[i]) {
                    teamsTemp[teamNames[j]].members.push(teamValues[j].members[i]);
                  }
                }
              }

              break;
            case "radnom":
              for (let i = teamMembers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [teamMembers[i], teamMembers[j]] = [teamMembers[j], teamMembers[i]];
              }

              teamMembers.forEach((member, i) => {
                teamsTemp[teamNames[i % teamNames.length]].members.push(member);
              });

              break;
            default:
              throw new Error(null);
          }
          
          for (const team of Object.values(teamsTemp)) {
            team.members.sort((a, b) => a.name.localeCompare(b.name));
          }
          setTeams(teamsTemp);
        } catch (err) {
          alert('팀 섞기에 실패하였습니다.');
          // window.location.reload();
          throw err;
        }
      }
    });
  };

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
                  {profile.name ? '수정' : '추가'}
                </Button>
                <Button
                  style={{ marginLeft: '20px', background: '#dc3545' }}
                  onClick={async () => {
                    try {
                      if ((await axios.get('/api/teams')).data.length <= 2) {
                        alert('두 팀 이상이 필요합니다.');
                        return;
                      }
                      await axios.delete(`/api/teams/name/${profile.name}`);
                      window.location.reload();
                    } catch (err) {
                      alert('팀 삭제에 실패하였습니다.');
                      window.location.reload();
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
          <p>종료하시면 팀 구성원 및 경기 기록이 초기화됩니다.</p>
        </div>
      ),
      okText: '확인',
      cancelText: '취소',
      async onOk() {
        try {
          const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
          if (recordData) {
            await Axios.delete(`/api/records/date/${now}`);
          }
          await Axios.patch('/api/teams/reset');
          window.location.reload();
        } catch (err) {
          alert('팀 초기화에 실패하였습니다.');
          window.location.reload();
          throw err;
        }
      }
    });
  };

  const submitAttendanceList = () => {
    let playerNum = 0;
    const list = Object.keys(teams).map(name => {
      playerNum += teams[name].members.length;
      return <p key={name}>{name}팀 인원: {teams[name].members.length}명</p>
    });
    if (!playerNum) {
      alert('팀에 선수를 등록해주세요.');
      return;
    }

    Modal.confirm({
      title: '명단 제출',
      content: (
        <div>
          {list}
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
          await Axios.patch(`/api/records/date/${now}/teams`, { teams });
          await Axios.patch('/api/teams', { teams });
          
          Modal.confirm({
            title: '경기 명단 공유',
            content: '경기 명단을 공유하시겠습니까?',
            okText: '공유',
            cancelText: '취소',
            onOk() {
              captureAndShare(teamRef.current, 'team');
              navigate('/');
            },
            onCancel() {
              navigate('/');
            }
          })
        } catch (err) {
          alert('명단 등록에 실패하였습니다.');
          window.location.reload();
          throw err;
        }
      }
    });
  };

  let date = new Date();
  let teamRef = useRef(null);

  if (loading) return <p>⏳ loading...</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      {(localStorage.getItem('isLoggedIn') === 'true') && (
        <div style={{ backgroundImage: `url(${list})` }}>
          <div style={{ padding: "10px", color: 'white' }}>
            <h1>경기 명단</h1>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => relocationTeam()}
              >
                팀 섞기
              </Button>
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
      )}

      <div ref={teamRef} style={{ padding: '20px', background: `url(${groundJpg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        {Object.keys(teams).map(name => (
          <div key={name} style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'white' }}>{name}</h2>
            <List
              grid={{ gutter: 10, column: 5 }}
              dataSource={teams[name].members}
              renderItem={(member) => (
                <List.Item>
                  <div style={{ textAlign: 'center' }} onClick={() => localStorage.getItem('isLoggedIn') ? removeFromTeam(member, name) : getPlayerInfo(member)}>
                    <img src={teams[name].image} alt={member.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <p style={{ color: 'white' }}>{member.name}</p>
                  </div>
                </List.Item>
              )}
            />
          </div>
        ))}
        {(localStorage.getItem('isLoggedIn') === 'true') && (
          <div style={{ marginTop: '70px' }}>
            <Button type="primary" onClick={() => initDailyTeam()} style={{ background: '#d9363e', width: '120px', height: '50px', borderRadius: '6px', fontSize: '16px', position: 'absolute', bottom: '1%', left: '4%' }}>초기화</Button>
            <Button type="primary" onClick={submitAttendanceList} style={{ background: '#2a85fb', width: '120px', height: '50px', borderRadius: '6px', fontSize: '16px', position: 'absolute', bottom: '1%', right: '4%' }}>저장</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
