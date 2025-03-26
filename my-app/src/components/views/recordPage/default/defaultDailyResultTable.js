import React, { useRef } from "react";
import Axios from 'axios';
import { Button, Modal } from 'antd';
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Search from "./search";
import captureAndShare from "../../adminPage/ShareResult";
import chartpage from '../../../images/chartpage.jpg'

function Table({ columns, data, filteredIds }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const initDailyChart = (ids) => {
    Modal.confirm({
      title: '기록 반영',
      content: (
        <div>
          <p>정말 종료하시겠습니까?</p>
          <p>종료하시면 차트가 초기화되며 경기 기록이 반영됩니다.</p>
          <p>당일 최종 반영할 때 사용을 권장합니다.</p>
        </div>
      ),
      okText: '반영',
      cancelText: '취소',
      onOk() {
        Axios.post('/api/record/plusPlays', {ids})
        .then(response => {
          if(response.data.success) {
            //window.location.reload();
          } else {
            alert('출석체크에 실패하였습니다.')
          }
        })

        Axios.post('/api/record/initDaily')
        .then(response => {
          if(response.data.success) {
            window.location.reload();
          } else {
            alert('차트 초기화(최종 반영)에 실패하였습니다.')
          }
        })
      },
      onCancel() {
          console.log('취소됨');
      },
    });
  };   

  let date = new Date();
  let resultRef = useRef(null);

  return (
    <div ref={resultRef} style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${chartpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "10px", color: "#fff", fontSize: "25px" }}>🏆경기 최종 결과🏆</h1>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡{date.toLocaleDateString()} 출석자 개인 기록입니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡기록이 오기입된 경우 매니저에게 문의해주세요!</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡승:3점 / 무:1점 / 패:0점</p>
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
        <Button type="primary" onClick={() => captureAndShare(resultRef)} style={{ background: '#30d946', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px', color: 'black', fontWeight: 'bolder' }}>결과공유✨</Button>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={() => initDailyChart(filteredIds)} style={{ background: '#2a85fb', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>경기종료(초기화)</Button>
      </div>
    </div>
  );
}

export default Table;
