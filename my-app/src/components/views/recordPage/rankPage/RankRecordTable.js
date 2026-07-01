import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { initValue, addValue } from '../../../utils';
import Table from "../default/defaultRankRecordTable";
import RankPolicyPage from "./RankPolicyPage";

const defaultComparator = (a, b) =>
  (b.pts - a.pts) ||
  (b.avg - a.avg) ||
  (b.plays - a.plays) ||
  (b.win - a.win) ||
  (a.lose - b.lose) ||
  (b.draw - a.draw) ||
  a.name.localeCompare(b.name);

function RankRecordTable() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rankPolicy, setRankPolicy] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const players = useRef([]);
  const periods = useRef([]);
  const recordsByDate = useRef({});

  useEffect(() => {
    async function getResult() {
      setLoading(true);
      try {
        const rankData = (await Axios.get('/api/settings/name/rank')).data;
        setRankPolicy(rankData.content);

        const playersData = (await Axios.get('/api/players')).data;
        players.current = playersData.reduce((ret, player) => {
          ret[player.id] = {
            name: player.name,
            metadata: player.metadata
          }
          return ret;
        }, {});

        const recordData = (await Axios.get('/api/records/type/month')).data;
        if (recordData.length === 0) throw new Error(null);

        const periodLength = Number(rankData.content.month);
        const periodMap = {};
        recordData.forEach(record => {
          recordsByDate.current[record.date] = record;

          const year = record.date.slice(0, 4);
          const monthNum = Number(record.date.slice(5, 7));
          const periodIdx = Math.floor((monthNum - 1) / periodLength);
          const startMonth = periodIdx * periodLength + 1;
          const endMonth = Math.min(startMonth + periodLength - 1, 12);
          const key = `${year}-${String(startMonth).padStart(2, '0')}`;

          if (!periodMap[key]) periodMap[key] = { key, year, startMonth, endMonth, dates: [] };
          periodMap[key].dates.push(record.date);
        });

        periods.current = Object.values(periodMap).sort((a, b) => b.key.localeCompare(a.key));
        setSelectedPeriod(periods.current[0].key);
      } catch (err) {
        alert('기록 가져오기를 실패하였습니다.');
        navigate('/');
        return;
      } finally {
        setLoading(false);
      }
    }
    getResult();
  }, [navigate]);

  const withTiebreaker = (primary, rowA, rowB, desc) => {
    if (primary !== 0) return primary;
    const tie = defaultComparator(rowA.original, rowB.original);
    return desc ? -tie : tie;
  };

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
      }
    ], []
  );

  const currentPeriod = useMemo(
    () => periods.current.find(p => p.key === selectedPeriod),
    [selectedPeriod]
  );

  const result = useMemo(() => {
    if (!currentPeriod) return {};
    const resultTemp = {};
    currentPeriod.dates.forEach(date => {
      const record = recordsByDate.current[date];
      Object.keys(record.result).forEach(id => {
        if (!resultTemp[id]) resultTemp[id] = initValue();
        addValue(resultTemp[id], record.result[id]);
      });
    });
    return resultTemp;
  }, [currentPeriod]);

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

  const highlightSet = new Set(indexedData.slice(0, rankPolicy.num).map(d => d.name));

  if (loading || !currentPeriod) return <p>⏳ loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'yellow', padding: '5px' }}>
        <RankPolicyPage rankPolicy={rankPolicy} />

        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
          style={{ height: '30px', width: '160px' }}
        >
          {periods.current.map((p) => {
            const start = String(p.startMonth).padStart(2, '0');
            const end = String(p.endMonth).padStart(2, '0');
            return (
              <option key={p.key} value={p.key}>
                {p.startMonth === p.endMonth ? `${p.year}년 ${start}월` : `${p.year}년 ${start}~${end}월`}
              </option>
            );
          })}
        </select>
      </div>
      <Table columns={columns} data={indexedData} rankPolicy={{ ...rankPolicy, start: currentPeriod.startMonth, end: currentPeriod.endMonth }} highlightSet={highlightSet} />
    </div>
  );
}

export default RankRecordTable;
