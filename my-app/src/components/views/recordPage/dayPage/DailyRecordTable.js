import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button, Modal } from 'antd'
import dayjs from 'dayjs';
import Table from "../default/defaultDailyRecordTable";

function YearChartTable() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);
    const [year, setYear] = useState(dayjs().format('YYYY'));
    const [day, setDay] = useState(null);
    const years = useRef([]);
    const days = useRef([]);
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});
    const players = useRef([]);
		const lastRecord = useRef(null);

    useEffect(() => {
        async function getDate() {
            setLoading(true);
            try {
                const recordData = (await Axios.get('/api/records/type/year')).data;
                years.current = recordData.map((record) => record.date);
                lastRecord.current = (await Axios.get('/api/records/last')).data;
                if (!lastRecord.current) throw new Error(null);
                setYear(lastRecord.current.date.slice(0, 4));

                const playersData = (await Axios.get('/api/players')).data;
                players.current = playersData.reduce((ret, player) => {
                    ret[player.id] = {
                        name: player.name,
                        metadata: player.metadata
                    }
                    return ret;
                }, {});
            } catch {
                alert('기록이 존재하지 않습니다.');
                navigate('/');
                return;
            } finally {
                setLoading(false);
            }
        }
        getDate();
    }, [navigate]);

    useEffect(() => {
        async function getDays() {
            try {
                if (buttonRefs.current[year]) {
                    buttonRefs.current[year].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
                }

                const recordData = (await Axios.get(`/api/records/type/day/date/${year}`)).data;
                if (recordData.length === 0) throw new Error(null);
                days.current = recordData.reverse().map((record) => record.date);
                setDay(days.current[0]);
            } catch {
                alert('기록이 존재하지 않습니다.');
                window.location.reload();
            }
        }
        getDays();
    }, [navigate, loading, year]);

    useEffect(() => {
        async function getResult() {
            if (!day) return;

            try {
                const recordData = (await Axios.get(`/api/records/date/${day}`)).data;
                setResult(recordData.result);
            } catch (err) {
                alert('차트 가져오기를 실패하였습니다.');
                throw err;
            }
        }
        getResult();
    }, [day]);

    const getPlayers = async (log) => {
        Modal.info({
            icon: null,
            content: (
                <div>
                    {Object.keys(log).map(name => 
                        <div key={name}>
                            <p style={{ marginTop: '30px', marginBottom: '20px', fontWeight: 'bold' }}>{name}팀 명단</p>
                            {log[name].playersId.map(id => {
                                if (players.current[id]) {
                                  return (
                                    <p key={id}>
																				<span style={{ fontWeight: 'bold' }}>{players.current[id].name}</span>
																				{(players.current[id].metadata.alias && players.current[id].metadata.number) && (<span>, {players.current[id].metadata.alias}({players.current[id].metadata.number})</span>)}
                                    </p>
                                  )
                                } else return <p key={id}>알 수 없음</p>
                            })}
                        </div>
                    )}
                </div>
            ),
            okText: '닫기'
        })
    }

    const getDetail = async () => {
        try {
            const recordData = (await Axios.get(`/api/records/date/${day}`)).data;
            const log = recordData.metadata.log;

            Modal.info({
                title: '상세 경기 결과',
                content: (
                    <div>
                        {Object.keys(log).map(match => 
                            <div key={match}>
                                <p style={{ fontWeight: 'bold' }}>{match}번 경기 결과</p>
                                {Object.keys(log[match]).map(name =>
                                    <div key={name}>
                                        <p>
                                            {name}팀 {(log[match][name].type === 'win') ? '승리' : (log[match][name].type === 'draw') ? '무승부' : '패배'}
                                        </p>
                                    </div>
                                )}
                                <Button
                                    onClick={() => getPlayers(log[match])}
                                >
                                    명단보기
                                </Button>
                            </div>
                        )}
                    </div>
                ),
                okText: '닫기'
            });
        } catch (err) {
            alert('상세 경기 결과 가져오기를 실패하였습니다.');
            throw err;
        }
    }

    const columns = useMemo(
        () => [
            {
                accessor: "rank",
                Header: "RANK",
            },
            {
                accessor: "name",
                Header: "NAME",
            },
            {
                accessor: "win",
                Header: "W",
            },
            {
                accessor: "draw",
                Header: "D",
            },
            {
                accessor: "lose",
                Header: "L",
            },
            {
                accessor: "pts",
                Header: "PTS",
            },
            {
                accessor: "avg",
                Header: "AVG",
                sortType: (rowA, rowB, column) => {
                    const a = Number(rowA.values[column]);
                    const b = Number(rowB.values[column]);
                    return a - b;
                }
            },
        ], []
    );

    let Data = Object.keys(result)
      .filter(id => players.current[id] ? true : false)
      .map(id => ({
          name: players.current[id].name,
          metadata: players.current[id].metadata,
          ...result[id]
      }))
      .sort((a, b) => (b.pts - a.pts) || (b.avg - a.avg) || (b.plays - a.plays) || a.name.localeCompare(b.name));

    let playerRank = 0;
    let indexedData = Data.map((item, index, array) => {
        if (index > 0 && array[index].pts === array[index - 1].pts) {
            return { ...item, rank: playerRank };
        } else {
            playerRank ++;
            return { ...item, rank: playerRank };
        }
    });

    const buttonStyle = (isActive) => ({
        marginRight: '10px',
        padding: '10px 20px',
        border: 'none',
        backgroundColor: isActive ? '#007bff' : 'rgb(227 227 227)',
        color: isActive ? 'white' : 'black',
        cursor: 'pointer',
        fontSize: '16px'
    });

    const scrollContainerStyle = {
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        backgroundColor: 'yellow',
        padding: '10px 0'
    };

    if (loading) return <p>⏳ loading...</p>;

    return (
        <div>
            <div style={scrollContainerStyle} ref={scrollRef}>
              {years.current.map((y) => (
                  <button
                      key={y}
                      style={buttonStyle(year === y)}
                      onClick={() => setYear(y)}
                      ref={(el) => buttonRefs.current[y] = el}
                  >
                      {y}년
                  </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'yellow', padding: '5px' }}>
                <button
                    onClick={() => getDetail()}
                >
                    상세보기
                </button>

                <select
                    onChange={e => setDay(e.target.value)}
                    style={{ height: '30px', width: '100px' }}
                >
                    {days.current.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
            <Table columns={columns} data={indexedData} date={day} lastRecord={lastRecord.current} />
        </div>
    );
}

export default YearChartTable;