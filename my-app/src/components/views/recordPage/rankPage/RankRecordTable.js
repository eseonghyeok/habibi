import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';
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
  const [result, setResult] = useState([]);
  const [rankPolicy, setRankPolicy] = useState({});
  const players = useRef([]);
  const period = useRef({})

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

        const recordData = (await Axios.get(`/api/records/type/month/date/${dayjs().format('YYYY')}`)).data;
        while (recordData.length > rankData.content.month) {
          recordData.splice(0, Number(rankData.content.month));
        }
        period.current.start = Number(recordData[0].date.split('-')[1]);
        period.current.end = Math.min(period.current.start + Number(rankData.content.month) - 1, 12);

        const resultTemp = {}
        recordData.forEach(record => {
          Object.keys(record.result).forEach(id => {
            if (!resultTemp[id]) resultTemp[id] = initValue();
            addValue(resultTemp[id], record.result[id]);
          });
        });
        setResult(resultTemp);
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

  if (loading) return <p>⏳ loading...</p>;

  return (
    <div>
      <RankPolicyPage rankPolicy={rankPolicy} />
      <Table columns={columns} data={indexedData} rankPolicy={{ ...rankPolicy, ...period.current }} highlightSet={highlightSet} />
    </div>
  );
}

export default RankRecordTable;
