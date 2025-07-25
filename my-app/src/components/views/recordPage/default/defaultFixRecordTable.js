import { useTable, useGlobalFilter, useSortBy } from "react-table";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button, Modal } from 'antd';
import Search from "./search";
import { playerInfo } from '../../../utils';
import chartpage from '../../../images/chartpage.jpg'

function Table({ columns, data, now }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);
  const navigate = useNavigate();

  const fixPlays = async (player) => {
    const isPlay = player.isPlay === 'O' ? true : false;
    Modal.confirm({
      title: '출석 변경',
      content: (
        <div>
          {playerInfo(player)}
          <br />
          <p><span style={{ fontWeight: 'bolder' }}>{isPlay ? '불참' : '출석'}</span>으로 변경하시겠습니까?</p>
        </div>
      ),
      okText: '변경',
      cancelText: '취소',
      async onOk() {
        try {
          await Axios.patch(`/api/players/id/${player.id}/plays`, {
            isPlay: !isPlay,
            date: now
          });
          window.location.reload();
        } catch (err) {
          alert('출석 변경 실패하였습니다.');
          throw err;
        }
      }
    });
  }

  const deleteResult = async () => {
    Modal.confirm({
      title: '경기 결과 삭제',
      content: '경기 결과를 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      async onOk() {
        try {
          await Axios.delete(`/api/records/date/${now}`);
          navigate('/');
          return;
        } catch (err) {
          alert('경기 결과 삭제를 실패했습니다.');
          throw err;
        }
      }
    });
  }

  let date = new Date();

  return (
    <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${chartpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "10px", fontSize: "25px", color: '#ff6800' }}>⚠️{date.toLocaleDateString()} 기록 수정⚠️</h1>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡기록 수정 페이지에서는 오늘의 출석을 수정하거나 오늘의 경기 결과를 삭제할 수 있습니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡경기 기록이 있는 선수는 출석을 변경할 수 없으므로 보이지 않습니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡선수를 누르면 출석을 수정할 수 있습니다.</p>
        <Search
          onSubmit={setGlobalFilter} style={{ overflowX: "auto", padding: "0 30px" }}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          {...getTableProps()}
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "11px",
            backgroundColor: "rgba(255, 255, 255, 0)",
            marginBottom: '30px'
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      padding: "6px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: '15px',
                      textAlign: "center",
                      backgroundColor: "transparent",
                      width: "60px"
                    }}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        backgroundColor: cell.row.original.isPlay === 'O' ? "#8000ffcc" : "#100995cc",
                        padding: "8px",
                        borderBottom: "2px solid #ffffff1a",
                        color: "white",
                        textAlign: "center",
                        fontSize: '12px'
                      }}
                      onClick={() => fixPlays(cell.row.original)}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={() => deleteResult()} style={{ background: '#dc3545', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>경기결과삭제✖️</Button>
      </div>
    </div>
  );
}

export default Table;