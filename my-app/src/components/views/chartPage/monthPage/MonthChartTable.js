import React, { useEffect, useState, useMemo } from 'react'
import Axios from 'axios';
import Table from "../default/defaultMonthTable";

function MonthChartTable() {
    const [Player, setPlayer] = useState([])
    const [month, setMonth] = useState('7')

    useEffect(() => { 
        Axios.get(`/api/chart/month/${month}`)
        .then(response => {
            if(response.data.success) {
                if (response.data.monthChart) {
                    setPlayer(response.data.monthChart.players)
                } else {
                    setPlayer(response.data.otherChart.players)
                }
            } else {
                alert('월간차트 가져오기를 실패하였습니다.')
            }
        })  
    }, [month])

    const columns = useMemo(
        () => [
            {
                accessor: "rank",
                Header: "RANK",
            },
            {
                accessor: "name",
                Header: "NAME",
            },
            {
                accessor: "goal",
                Header: "G",
            },
            {
                accessor: "assist",
                Header: "A",
            },
            {
                accessor: "plays",
                Header: "P",
            },
            {
                accessor: "pts",
                Header: "PTS",
            },
        ], []
    );

    let Data = Player.sort(function(a, b) {
        return b.pts - a.pts; // 내림차순 정렬
    });
    
    let playerRank = 0;
    let indexedData = Data.map((item, index, array) => {
        if (index > 0 && array[index].pts === array[index - 1].pts) {
            return { ...item, rank: playerRank };
        } else {
            playerRank ++;
            return { ...item, rank: playerRank };
        }
    });
    
    const buttonStyle = (isActive) => ({
        marginRight: '10px',
        padding: '10px 20px',
        border: 'none',
        backgroundColor: isActive ? '#007bff' : 'rgb(227 227 227)',
        color: isActive ? 'white' : 'black',
        cursor: 'pointer',
        fontSize: '16px'
    });

    return (
        <div>
            <div style={{backgroundColor: 'yellow'}}>
                <button style={buttonStyle(month === '3')} onClick={() => setMonth('3')}>3월</button>
                <button style={buttonStyle(month === '4')} onClick={() => setMonth('4')}>4월</button>
                <button style={buttonStyle(month === '5')} onClick={() => setMonth('5')}>5월</button>
                <button style={buttonStyle(month === '6')} onClick={() => setMonth('6')}>6월</button>
                <button style={buttonStyle(month === '7')} onClick={() => setMonth('7')}>7월</button>
            </div>
            <Table columns={columns} data={indexedData} />
        </div>
    );
}

export default MonthChartTable;