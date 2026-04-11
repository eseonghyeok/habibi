import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';
import Table from "../default/defaultYearRecordTable";

const defaultComparator = (a, b) =>
  (b.pts - a.pts) ||
  (b.avg - a.avg) ||
  (b.plays - a.plays) ||
  (b.win - a.win) ||
  (a.lose - b.lose) ||
  (b.draw - a.draw) ||
  a.name.localeCompare(b.name);

const withTiebreaker = (primary, rowA, rowB, desc) => {
  if (primary !== 0) return primary;
  const tie = defaultComparator(rowA.original, rowB.original);
  return desc ? -tie : tie;
};

function YearRecordTable() {
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
        window.location.reload();
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
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.rank - rowB.original.rank, rowA, rowB, desc),
      },
      {
        accessor: "name",
        Header: "NAME",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.name.localeCompare(rowB.original.name), rowA, rowB, desc),
      },
      {
        accessor: "win",
        Header: "W",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.win - rowB.original.win, rowA, rowB, desc),
      },
      {
        accessor: "draw",
        Header: "D",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.draw - rowB.original.draw, rowA, rowB, desc),
      },
      {
        accessor: "lose",
        Header: "L",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.lose - rowB.original.lose, rowA, rowB, desc),
      },
      {
        accessor: "plays",
        Header: "P",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.plays - rowB.original.plays, rowA, rowB, desc),
      },
      {
        accessor: "pts",
        Header: "PTS",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.pts - rowB.original.pts, rowA, rowB, desc),
      },
      {
        accessor: "avgString",
        Header: "AVG",
        sortType: (rowA, rowB, _, desc) => withTiebreaker(rowA.original.avg - rowB.original.avg, rowA, rowB, desc),
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
    .sort(defaultComparator);

  let playerRank = 0;
  let indexedData = Data.map((item, index, array) => {
    if (index > 0 && defaultComparator(array[index], array[index - 1]) === 0) {
      return { ...item, rank: playerRank };
    } else {
      playerRank++;
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

export default YearRecordTable;