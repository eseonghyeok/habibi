import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';
import Table from '../default/defaultAttendanceCheckTable'

function LineupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const result = useRef([]);
  const players = useRef([]);
  const now = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    async function getResult() {
      setLoading(true);
      try {
        const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
        if (!recordData) {
          await Axios.post(`/api/records/date/${now}`);
          window.location.reload();
          return;
        } else if (Object.keys(recordData.metadata.teams).length !== 0) {
          alert('경기 진행 중에는 불가능하므로 팀 초기화하거나 경기 종료 이후에 진행해주세요.');
          navigate('/');
          return;
        }
        result.current = recordData.result;

        const playersData = (await Axios.get('/api/players')).data;
        players.current = playersData.reduce((ret, player) => {
          ret[player.id] = {
            name: player.name,
            metadata: player.metadata
          }
          return ret;
        }, {});
      } catch (err) {
        alert('오늘의 경기 결과 가져오기를 실패하였습니다.');
        window.location.reload();
        throw err;
      } finally {
        setLoading(false);
      }
    }
    getResult();
  }, [navigate, now])

  const columns = useMemo(
    () => [
      {
        accessor: "name",
        Header: "NAME",
      },
      {
        accessor: "isPlay",
        Header: "PLAY",
      }
    ], []
  );

  let Data = Object.keys(players.current)
    .filter(id => (result.current[id] && (result.current[id].matches > 0)) ? false : true)
    .map(id => ({
      id,
      name: players.current[id].name,
      metadata: players.current[id].metadata,
      isPlay: result.current[id] ? "O" : "X"
    }))
    .sort((a, b) => ((a.isPlay !== b.isPlay) ? ((b.isPlay === "O") ? 1 : -1) : 0) || a.name.localeCompare(b.name));

  if (loading) return <p>⏳ loading...</p>;

  return <Table columns={columns} data={Data} date={now} />;
}

export default LineupPage;