import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import dayjs from 'dayjs';
import { getPlayerInfo } from '../../../utils';
import groundJpg from '../../../images/ground.png';
import captureAndShare from "../../adminPage/ShareResult";

function DailyTeamPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [record, setRecord] = useState({});
  const match = useRef(1);
  const modalCheck = useRef(false);
  const now = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    async function getTeams() {
      setLoading(true);
      try {
        const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
        if (!recordData) {
          alert('경기 명단 저장 이후에 진행하세요.');
          navigate('/attendance');
          return;
        } else if (Object.keys(recordData.result).length > 0) {
          alert('이미 오늘 경기를 종료하였습니다.');
          navigate('/record/day');
          return;
        }

        let playerNum = 0;
        const teamsTemp = {}
        const recordTemp = {}
        const teamsData = (await Axios.get('/api/teams')).data;
        for (const team of teamsData) {
          teamsTemp[team.name] = {
            image: team.metadata.image,
            players: (await Axios.get(`/api/teams/name/${team.name}/players`)).data
          }
          playerNum += teamsTemp[team.name].players.length;

          recordTemp[team.name] = {
            win: 0,
            draw: 0,
            lose: 0
          }
        }

        if (playerNum === 0) {
          if (Object.keys(recordData.metadata.teams).length > 0) {
            await Axios.patch('/api/teams', {
              teams: recordData.metadata.teams
            });
            window.location.reload();
          }
        }

        for (const matchLog of Object.values(recordData.metadata.log)) {
          for (const name of Object.keys(matchLog)) {
            recordTemp[name][matchLog[name].type]++;
          }
          match.current++;
        }

        setTeams(teamsTemp);
        setRecord(recordTemp);
      } catch (err) {
        alert('오늘의 팀 정보 가져오기를 실패하였습니다.');
        window.location.reload();
        throw err;
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, [navigate, now]);

  const setLog = async (name, type) => {
    try {
      const secondTeamType = (type === 'win') ? 'lose' : (type === 'draw') ? 'draw' : 'win';

      Modal.info({
        title: `${(type === 'win') ? '패배' : (type === 'draw') ? '무승부' : '승리'}한 팀을 선택해 주세요.`,
        content: (
          <div>
            {Object.keys(teams).filter(secondTeamName => secondTeamName !== name).map(secondTeamName =>
              <Button
                key={secondTeamName}
                onClick={async () => {
                  if (modalCheck.current) return;
                  modalCheck.current = true;
                  setLoading(true);
                  try {
                    if ((Object.keys((await Axios.get(`/api/records/date/${now}`)).data.metadata.log).length + 1) !== match.current) {
                      alert('기록이 변경 되었으므로 다시 시도해 주세요.');
                      window.location.reload();
                      return;
                    }

                    await Axios.patch(`/api/records/date/${now}/log`, {
                      match: match.current,
                      log: {
                        [name]: {
                          type,
                          playersId: teams[name].players.map(player => player.id)
                        },
                        [secondTeamName]: {
                          type: secondTeamType,
                          playersId: teams[secondTeamName].players.map(player => player.id)
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
                    window.location.reload();
                    throw err;
                  } finally {
                    modalCheck.current = false;
                    setLoading(false);
                  }
                }}
                icon={<img src={teams[secondTeamName].image} alt={secondTeamName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                style={{ background: 'transparent', border: 'none', padding: 0 }}
              >
                <span style={{ fontWeight: 'bold' }}>{secondTeamName}</span>
              </Button>
            )}
          </div>
        ),
        okText: '취소'
      });
    } catch (err) {
      alert('결과 반영에 실패하였습니다.');
      window.location.reload();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async () => {
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
          setLoading(true);
          try {
            if ((Object.keys((await Axios.get(`/api/records/date/${now}`)).data.metadata.log).length + 1) !== match.current) {
              alert('기록이 변경 되었으므로 다시 시도해 주세요.');
              window.location.reload();
              return;
            }

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
            window.location.reload();
            throw err;
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
      window.location.reload();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finishPlay = async () => {
    setLoading(true);
    try {
      if (match.current === 1) {
        alert('기록이 존재하지 않습니다.');
        setLoading(false);
        return;
      }

      Modal.confirm({
        title: '경기 결과 반영',
        content: (
          <div>
            {Object.keys(record).map(name =>
              <div key={name}>
                <img src={teams[name].image} alt={name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                <span style={{ fontWeight: 'bold' }}>{name}</span>
                <p>승리: {record[name].win}, 무승부: {record[name].draw}, 패배: {record[name].lose}</p>
              </div>,
            )}
            <br />
            <p>정말 종료하시겠습니까?</p>
            <p>종료하시면 차트가 초기화되며 경기 결과가 반영됩니다.</p>
            <p>당일 최종 반영할 때 사용을 권장합니다.</p>
          </div>
        ),
        okText: '반영',
        cancelText: '취소',
        async onOk() {
          setLoading(true);
          try {
            if ((Object.keys((await Axios.get(`/api/records/date/${now}`)).data.metadata.log).length + 1) !== match.current) {
              alert('기록이 변경 되었으므로 다시 시도해 주세요.');
              window.location.reload();
              return;
            }

            await Axios.patch(`/api/records/date/${now}`);
            await Axios.patch('/api/teams/reset');

            Modal.confirm({
              title: '경기 결과 공유',
              content: '경기 결과를 공유하시겠습니까?',
              okText: '공유',
              cancelText: '취소',
              onOk() {
                captureAndShare(recordRef.current, 'record');
                navigate('/');
              },
              onCancel() {
                navigate('/');
              }
            })
          } catch (err) {
            alert('결과 반영에 실패하였습니다.');
            window.location.reload();
            throw err;
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
      window.location.reload();
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
          <h1 style={{ fontSize: '27px', marginTop: '37px' }}>⚽ 오늘의 팀 승점기록 ⚽</h1>
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
                  <div style={{ textAlign: 'center' }} onClick={() => getPlayerInfo(member)}>
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
          <Button type="primary" onClick={() => deleteLog()} style={{ background: '#dc3545', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>최근기록삭제✖️</Button>
          <Button type="primary" onClick={() => finishPlay()} style={{ background: '#30d946', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>경기종료🔔</Button>
        </div>
      </div>
    </div>
  );
}

export default DailyTeamPage;
