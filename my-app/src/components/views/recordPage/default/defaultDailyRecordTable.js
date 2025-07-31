import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Axios from 'axios';
import { Button, Modal } from 'antd';
import Search from "./search";
import dayjs from 'dayjs';
import { getPlayerInfo } from '../../../utils';
import chartpage from '../../../images/chartpage.jpg'

function Table({ columns, data, date }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);
  const now = dayjs().format('YYYY-MM-DD');

  const deleteResult = async () => {
    Modal.confirm({
      content: '경기 결과를 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      async onOk() {
        try {
          await Axios.delete(`/api/records/date/${now}`);
          window.location.reload();
        } catch (err) {
          alert('경기 결과 삭제를 실패했습니다.');
          throw err;
        }
      }
    });
  }

  return (
    <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${chartpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "10px", color: "#fff", fontSize: "25px" }}>📋경기 결과📋</h1>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡경기 결과 페이지에서는 경기 결과를 상세하게 확인할 수 있습니다.</p>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡경기 결과 페이지에서는 오늘 경기 결과를 삭제할 수 있습니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡점수는 승무패 기록으로 합산됩니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡선수를 누르면 선수 정보를 확인할 수 있습니다.</p>
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
                <tr {...row.getRowProps()} style={{ backgroundColor: i === 0 ? "#8000ffcc" : "#100995cc", fontWeight: i === 0 ? "bold" : "400" }}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "8px",
                        borderBottom: "2px solid #ffffff1a",
                        color: "white",
                        textAlign: "center",
                        fontSize: '12px'
                      }}
                      onClick={() => getPlayerInfo(row.original)}
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
      {(now === date) && (localStorage.getItem('isLoggedIn') === 'true') && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={() => deleteResult()} style={{ background: '#dc3545', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>경기결과삭제✖️</Button>
        </div>
      )}
    </div>
  );
}

export default Table;
