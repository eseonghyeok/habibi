import React from "react";
import Axios from 'axios';
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import { Button, Modal } from 'antd';
import Search from "./search";
import chartpage from './chartpage.jpg'

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable({ columns, data }, useGlobalFilter, useSortBy);

    const initDailyChart = () => {
        Modal.confirm({
            title: '선수기록 최종반영',
            content: (
                <div>
                    <p>정말 종료하시겠습니까?</p>
                    <p>종료하시면 차트가 초기화됩니다.</p>
                    <p>당일 최종 반영할 때 사용을 권장합니다.</p>
                </div>
            ),
            okText: '반영',
            cancelText: '취소',
            onOk() {
                Axios.post('/api/chart/initDaily')
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

    const plusGoalbyId = (id) => {
        Axios.post('/api/chart/plusGoal', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('골 반영을 실패하였습니다.')
                }
            })
    };

    const plusAssistbyId = (id) => {
        Axios.post('/api/chart/plusAssist', { id })
            .then(response => {
                if(response.data.success) {
                    window.location.reload();
                } else {
                    alert('어시스트 반영을 실패하였습니다.')
                }
            })
    };

    let date = new Date();

    return (
        <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${chartpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h1 style={{ marginBottom: "10px", color: "#fff", fontSize: "25px" }}>🏆{date.toLocaleDateString()} HABIBI POINT🏆</h1>
                <p style={{ fontSize: '11px', color: "#fff" }}>💡기록체크 페이지에서는 매니저가 직접 선수들의 당일 공격포인트를 기록할 수 있습니다.</p>
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
                            <th style={{ padding: "12px", borderBottom: "2px solid #007bff", color: "#007bff", fontWeight: "bold", textAlign: "center", textTransform: "uppercase", backgroundColor: "#f2f2f2", width: "60px" }}>➕</th>
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
                                    <button onClick={() => plusGoalbyId(row.original.id)} style={{ fontSize: "1.8em", backgroundColor: "transparent", border: "none" }}>⚽️</button>
                                    <button onClick={() => plusAssistbyId(row.original.id)} style={{ fontSize: "1.8em", backgroundColor: "transparent", border: "none" }}>🎯</button>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" onClick={() => initDailyChart()} style={{ background: '#2a85fb', width: '145px', height: '45px', borderRadius: '6px', fontSize: '13px', marginTop: '10px' }}>경기종료(최종반영)</Button>
            </div>
        </div>
    );
}

export default Table;
