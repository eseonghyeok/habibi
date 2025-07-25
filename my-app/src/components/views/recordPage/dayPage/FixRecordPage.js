import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Table from '../default/defaultFixRecordTable'
import dayjs from 'dayjs';

function FixRecordPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);
    const players = useRef([]);
    const now = dayjs().format('YYYY-MM-DD');

    useEffect(() => { 
        async function getResult() {
            setLoading(true);
            try {
                const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
                if (!recordData || (Object.keys(recordData.result).length === 0)) {
                    alert('오늘 경기 결과가 없습니다.');
                    navigate('/');
                    return;
                }

                const playersData = (await Axios.get('/api/players')).data;
                players.current = playersData.reduce((ret, player) => {
                    ret[player.id] = {
                        name: player.name,
                        info: player.info
                    }
                    return ret;
                }, {});

                setResult(recordData.result);
            } catch (err) {
                alert('오늘의 경기 결과 가져오기를 실패하였습니다.');
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
      .filter(id => (result[id] && (result[id].matches > 0)) ? false : true)
      .map(id => ({
          id,
          name: players.current[id].name,
          info: players.current[id].info,
          isPlay: result[id] ? "O" : "X"
      }))
      .sort((a, b) => ((a.isPlay !== b.isPlay) ? ((b.isPlay === "O") ? 1 : -1) : 0) || a.name.localeCompare(b.name));

    if (loading) return <p>⏳ loading...</p>;
    
    return <Table columns={columns} data={Data} now={now} />;
}

export default FixRecordPage;