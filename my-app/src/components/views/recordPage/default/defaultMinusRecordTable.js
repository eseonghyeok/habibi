import React from "react";
import Axios from 'axios';
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Search from "./search";

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

    const minusWinbyId = (id) => {
        Axios.post('/api/record/minusWin', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('승리 반영을 실패하였습니다.')
                }
            })
    };

    const minusDrawbyId = (id) => {
        Axios.post('/api/record/minusDraw', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('무승부 반영을 실패하였습니다.')
                }
            })
    };

    const minusLosebyId = (id) => {
        Axios.post('/api/record/minusLose', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('패배 반영을 실패하였습니다.')
                }
            })
    };

    const minusPlaysbyId = (id) => {
        Axios.post('/api/record/minusPlays', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('경기수 반영을 실패하였습니다.')
                }
            })
    };

    let date = new Date();

    return (
        <div style={{ minHeight: "100vh", padding: "10px", backgroundColor: "black", backgroundPosition: "center" }}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h1 style={{ marginBottom: "10px", fontSize: "25px", color: '#ff6800' }}>⚠️{date.toLocaleDateString()} 기록 차감⚠️</h1>
                <p style={{ fontSize: '11px', color: "#fff" }}>💡기록수정 페이지에서는 매니저가 직접 오기입된 선수들의 차트 정보를 차감할 수 있습니다.</p>
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
                            <th style={{ padding: "12px", borderBottom: "2px solid #007bff", color: "#007bff", fontWeight: "bold", textAlign: "center", textTransform: "uppercase", backgroundColor: "#f2f2f2", width: "60px" }}>➖</th>
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
                                        padding: "12px",
                                        borderBottom: "1px solid #ddd",
                                        color: "#333",
                                        textAlign: "center",
                                    }}
                                    >
                                    {cell.render("Cell")}
                                    </td>
                                ))}
                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd", color: "#333", textAlign: "center" }}>
                                    <button onClick={() => minusWinbyId(row.original.id)} style={{ backgroundColor: "transparent", border: "none" }}>🥇</button>
                                    <button onClick={() => minusDrawbyId(row.original.id)} style={{ backgroundColor: "transparent", border: "none" }}>🥈</button>
                                    <button onClick={() => minusLosebyId(row.original.id)} style={{ backgroundColor: "transparent", border: "none" }}>🥉</button>
                                    <button onClick={() => minusPlaysbyId(row.original.id)} style={{ backgroundColor: "transparent", border: "none" }}>🏃</button>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;