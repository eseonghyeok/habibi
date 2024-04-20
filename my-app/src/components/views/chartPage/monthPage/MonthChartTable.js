import React, { useEffect, useState, useMemo } from 'react'
import Axios from 'axios';
import Table from "../default/defaultMonthTable";

function MonthChartTable() {
    const [Player, setPlayer] = useState([])

    useEffect(() => { 
        Axios.get('/api/chart/month')
        .then(response => {
            if(response.data.success) {
                setPlayer(response.data.monthChart.players)
            } else {
                alert('월간차트 가져오기를 실패하였습니다.')
            }
        })  
    }, [])

    const columns = useMemo(
        () => [
            {
                accessor: "rank",
                Header: "Rank",
            },
            {
                accessor: "name",
                Header: "Name",
            },
            {
                accessor: "goal",
                Header: "Goal",
            },
            {
                accessor: "assist",
                Header: "Assist",
            },
            {
                accessor: "plays",
                Header: "Plays",
            },
            {
                accessor: "pts",
                Header: "Pts.",
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
    
    return <Table columns={columns} data={indexedData} />;    
}

export default MonthChartTable;