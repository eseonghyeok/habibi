import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Axios from 'axios';
import Table from "../default/defaultMonthRecordTable";

function MonthChartTable() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const months = useRef([]);
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});
    const players = useRef([]);
    const now = dayjs().format('YYYY');

    useEffect(() => {
        async function getDate() {
            setLoading(true);
            try {
                const recordsData = (await Axios.get(`/api/records/type/month/date/${now}`)).data;
                const yearTemp = recordsData.at(-1).date.slice(0, 4);
                months.current = recordsData.map((record) => String(Number(record.date.slice(5, 7))));
                setYear(yearTemp);
                setMonth(months.current.at(-1));

                const playersData = (await Axios.get('/api/players')).data;
                players.current = playersData.reduce((ret, player) => {
                    ret[player.id] = {
                        name: player.name,
                        info: player.info
                    }
                    return ret;
                }, {});
            } catch (err) {
                alert('기록이 존재하지 않습니다.');
                navigate('/');
                return;
            } finally {
                setLoading(false);
            }
        }
        getDate();
    }, [navigate, now]);

    useEffect(() => {
        async function getResult() {
            if (!month) return;

            try {
                if (buttonRefs.current[month]) {
                    buttonRefs.current[month].scrollIntoView({ inline: 'center', behavior: 'smooth' });
                }

                const recordData = (await Axios.get(`/api/records/date/${year}-${month.padStart(2, '0')}`)).data;
                setResult(recordData.result);
            } catch (err) {
                alert('월간차트 가져오기를 실패하였습니다.');
                throw err;
            }
        }
        getResult();
    }, [year, month]);

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
                accessor: "plays",
                Header: "P",
            },
            {
                accessor: "pts",
                Header: "PTS",
            },
            {
                accessor: "avg",
                Header: "AVG",
            },
        ], []
    );

    let Data = Object.keys(result)
      .filter(id => players.current[id])
      .map(id => ({
          name: players.current[id].name,
          info: players.current[id].info,
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
                {months.current.map((m) => (
                    <button
                        key={m}
                        style={buttonStyle(month === m)}
                        onClick={() => setMonth(m)}
                        ref={(el) => buttonRefs.current[m] = el}
                    >
                        {m}월
                    </button>
                ))}
            </div>
            <Table columns={columns} data={indexedData} />
        </div>
    );
}

export default MonthChartTable;
