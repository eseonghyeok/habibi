import React from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Search from "./search";
import chartpage from '../../../images/chartpage.jpg'

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${chartpage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "10px", color: "#fff", fontSize: "25px" }}>📋경기 결과📋</h1>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡경기 결과 페이지에서는 모든 경기에 대한 결과를 상세하게 확인할 수 있습니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡점수는 승무패 기록으로 합산됩니다.</p>
        <p style={{ fontSize: '10px', color: "#fff" }}>💡출석은 횟수로만 기록되며 점수에 포함되지 않습니다.</p>
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
    </div>
  );
}

export default Table;
