import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Table from "../default/defaultMonthRecordTable";

function MonthChartTable() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reulst, setResult] = useState([]);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});

    useEffect(() => {
        async function checkDate() {
            setLoading(true);
            try {
                const records = (await Axios.get('/api/records/type/day')).data;
                const [lastYear, lastMonth] = records.at(-1).date.split('-');
                setYear(lastYear);
                setMonth(String(Number(lastMonth)));
            } catch (err) {
                alert('기록이 존재하지 않습니다.');
                navigate('/');
                return;
            } finally {
                setLoading(false);
            }
        }
        checkDate();
    }, [navigate]);

    useEffect(() => {
        async function getRecord() {
            if (!month) return;

            try {
                if (buttonRefs.current[month]) {
                    buttonRefs.current[month].scrollIntoView({ inline: 'center', behavior: 'smooth' });
                }

                const record = await Axios.get(`/api/records/date/${year}-${month.padStart(2, '0')}`);
                setResult(record.data.result);
            } catch (err) {
                alert('월간차트 가져오기를 실패하였습니다.');
                window.location.reload();
            }
        }
        getRecord();
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

    let Data = Object.values(reulst).sort((a, b) => (b.pts - a.pts) || (b.avg - a.avg) || (b.plays - a.plays) || a.name.localeCompare(b.name));

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
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => (
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
