import { useEffect, useState, useMemo, useRef } from 'react'
import Axios from 'axios';
import { Button } from 'antd';
import { PlayerModal } from '../../utils';
import Table from './defaultPlayerListTable'

function PlayerListPage() {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const players = useRef([]);
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    async function getDate() {
      setLoading(true);
      try {
        players.current = (await Axios.get('/api/players')).data;
      } catch (err) {
        alert('선수 목록 가져오기를 실패하였습니다.');
        window.location.reload();
        throw err;
      } finally {
        setLoading(false);
      }
    }
    getDate();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessor: "index",
        Header: "INDEX",
      },
      {
        accessor: "name",
        Header: "NAME",
      },
      {
        accessor: "back",
        Header: "BACK",
        sortType: (rowA, rowB, column) => {
          let a = rowA.values[column].split('(')[1].slice(0, -1);
          let b = rowB.values[column].split('(')[1].slice(0, -1);
          a = (a === '') ? -11 : (a[0] === '0') ? Number(a) - 10 : Number(a);
          b = (b === '') ? -11 : (b[0] === '0') ? Number(b) - 10 : Number(b);
          return a - b;
        }
      },
    ], []
  );

  let Data = players.current.sort((a, b) => a.name.localeCompare(b.name));

  let indexedData = Data.map((item, index) => ({ 
      index: index + 1,
      ...item,
      back: `${item.metadata.alias} (${item.metadata.number})`
  }));

  if (loading) return <p>⏳ loading...</p>;

  return (
    <div>
      {(isLoggedIn === 'true') && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'yellow', padding: '0px 20px 10px 20px' }}>
          <Button 
            type="primary"
            style={{ background: '#28a745', padding: '5px 10px' }}
            onClick={() => setModal(true)}
          >
            추가
          </Button>
      </div>
      )}
      <Table columns={columns} data={indexedData} isLoggedIn={isLoggedIn} />
      <PlayerModal
        open={modal}
        close={() => setModal(false)}
        player={null}
        isLogin={isLoggedIn}
      />
    </div>
  );
}

export default PlayerListPage;