import { useState } from 'react'
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Axios from 'axios';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { playerInfo, PlayerModal } from '../../utils';
import chartpage from '../../images/chartpage.jpg'


function Table({ columns, data, isLoggedIn }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);
  const [modal, setModal] = useState(false);
  const [player, setPlayer] = useState(null);
  const now = dayjs().format('YYYY-MM-DD');

  const deletePlayer = async (player) => {
    try {
      const recordData = (await Axios.get(`/api/records/date/${now}`)).data;
      if (recordData && (Object.keys(recordData.result).length === 0) && (Object.keys(recordData.metadata.log).length > 0)) {
        alert('경기 진행 중에는 불가능하므로 팀 초기화하거나 경기 종료 이후에 진행해주세요.');
        return;
      }
    } catch (err) {
      alert('기록 가져오기를 실패하였습니다.');
      window.location.reload();
      throw err;
    }

    Modal.confirm({
      title: '선수 삭제',
      content: (
        <div>
          {playerInfo(player)}
          <br />
          <p><span style={{ fontWeight: 'bold' }}>{player.name}</span>선수를 삭제하시겠습니까?</p>
        </div>
      ),
      okText: '삭제',
      cancelText: '취소',
      async onOk() {
        try {
          await Axios.delete(`/api/players/id/${player.id}`);
          window.location.reload();
        } catch (err) {
          alert('선수 삭제에 실패하였습니다.');
          window.location.reload();
          throw err;
        }
      }
    });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${chartpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "10px", color: "#fff", fontSize: "23px" }}>선수 정보</h1>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡선수 정보 페이지에서는 선수 정보를 확인하거나 선수 추가/수정/삭제할 수 있습니다.</p>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡선수를 누르면 선수 정보를 확인할 수 있습니다.</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          {...getTableProps()}
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "0.9em",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #007bff",
                      color: "#007bff",
                      fontWeight: "bold",
                      textAlign: "center",
                      textTransform: "uppercase",
                      backgroundColor: "#f2f2f2",
                      width: "60px",
                    }}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " ⬇️" : " ⬆️") : ""}
                    </span>
                  </th>
                ))}
                {(isLoggedIn === 'true') && (
                  <th style={{ padding: "12px", borderBottom: "2px solid #007bff", color: "#007bff", fontWeight: "bold", textAlign: "center", textTransform: "uppercase", backgroundColor: "#f2f2f2", width: "60px" }}>➖</th>
                )}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "5px",
                        borderBottom: "1px solid #ddd",
                        color: "#333",
                        textAlign: "center",
                      }}
                      onClick={() => {
                        setPlayer(row.original);
                        setModal(true);
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                  {(isLoggedIn === 'true') && (
                    <td style={{
                      padding: '10px',
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      alignItems: 'space-between'
                    }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <Button
                          type="primary"
                          style={{ background: '#dc3545' }}
                          onClick={() => deletePlayer(row.original)}>
                          삭제
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PlayerModal
        open={modal}
        close={() => setModal(false)}
        player={player}
        isLogin={isLoggedIn}
      />
    </div>
  );
}

export default Table;
