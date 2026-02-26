import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Search from "./search";
import { getPlayerInfo } from '../../../utils';
import chartpage from '../../../images/chartpage.jpg'

function Table({ columns, data, rankPolicy }) {
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
        <h1 style={{ marginBottom: "10px", color: "#fff", fontSize: "25px" }}> 순위표 ({rankPolicy.start}월 ~ {rankPolicy.end}월) </h1>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡순위표 페이지에서는 선수들의 순위를 확인할 수 있습니다.</p>
        <p style={{ fontSize: '11px', color: "#fff" }}>💡포상 정책을 눌러 자세한 포상 정책을 확인할 수 있습니다.</p>
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
                    {...column.getHeaderProps()}
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={{ backgroundColor: i < rankPolicy.num ? "#8000ffcc" : "#100995cc", fontWeight: i < rankPolicy.num ? "bold" : "400" }}>
                  {row.cells.map((cell, index) => (
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
                      { index === 0 && i ===0 ? (
                        <span>🥇</span>
                      ) : index === 0 && i === 1 ? (
                        <span>🥈</span>
                      ) : index === 0 && i === 2 ? (
                        <span>🥉</span>
                      ) : (
                        cell.render("Cell")
                      )}
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
