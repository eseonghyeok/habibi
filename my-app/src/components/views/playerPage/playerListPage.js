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
        accessor: "info.birth",
        Header: "BIRTH",
      },
      {
        accessor: "info.number",
        Header: "BACK NUMBER",
      },
      {
        accessor: "info.alias",
        Header: "BACK NAME",
      },
    ], []
  );

  let Data = players.current.sort((a, b) => a.name.localeCompare(b.name));

  let indexedData = Data.map((item, index) => {
    return { index: index + 1, ...item };
  });

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
      />
    </div>
  );
}

export default PlayerListPage;