import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';
import Table from "../default/defaultYearRecordTable";

function YearChartTable() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);
    const [year, setYear] = useState(dayjs().format('YYYY'));
    const years = useRef([]);
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});
    const players = useRef([]);

    useEffect(() => {
        async function getDate() {
            setLoading(true);
            try {
                const recordsData = (await Axios.get('/api/records/type/year')).data;
                years.current = recordsData.map((record) => record.date);

                const playersData = (await Axios.get('/api/players')).data;
                players.current = playersData.reduce((ret, player) => {
                    ret[player.id] = {
                        name: player.name,
                        metadata: player.metadata
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
    }, [navigate]);

    useEffect(() => {
        async function getResult() {
            try {
                if (buttonRefs.current[year]) {
                    buttonRefs.current[year].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
                }

                const recordData = (await Axios.get(`/api/records/date/${year}`)).data;
                setResult(recordData.result);
            } catch (err) {
                alert('연간차트 가져오기를 실패하였습니다.');
                throw err;
            }
        }
        getResult();
    }, [loading, year]);

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
                accessor: "avgString",
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
          ...result[id],
          avgString: result[id].avg.toFixed(2)
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
            <Table columns={columns} data={indexedData} />
        </div>
    );
}

export default YearChartTable;