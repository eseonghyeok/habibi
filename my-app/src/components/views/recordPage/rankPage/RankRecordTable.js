import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';
import { initValue, addValue } from '../../../utils';
import Table from "../default/defaultRankRecordTable";
import RankPolicyPage from "./RankPolicyPage";

function RankRecordTable() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [rankPolicy, setRankPolicy] = useState({});
  const players = useRef([]);
  const period = useRef({})
  const year = dayjs().format('YYYY');

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
    .sort((a, b) => (b.pts - a.pts) || (b.avg - a.avg) || (b.plays - a.plays) || a.name.localeCompare(b.name));

  let playerRank = 0;
  let indexedData = Data.map((item, index, array) => {
    if (index > 0 && array[index].pts === array[index - 1].pts) {
      return { ...item, rank: playerRank };
    } else {
      playerRank++;
      return { ...item, rank: playerRank };
    }
  });

  if (loading) return <p>⏳ loading...</p>;

  return (
    <div>
      <RankPolicyPage
        rankPolicy={rankPolicy}
      />
      <Table columns={columns} data={indexedData} rankPolicy={{ ...rankPolicy, ...period.current }} />
    </div>
  );
}

export default RankRecordTable;
