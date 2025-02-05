import React, { useEffect, useState, useMemo } from 'react'
import Axios from 'axios';
import Table from "../default/defaultYearRecordTable";

function YearChartTable() {
    const [Player, setPlayer] = useState([])

    useEffect(() => { 
        Axios.get('/api/record/getYear')
        .then(response => {
            if(response.data.success) {
                setPlayer(response.data.yearChart.players)
            } else {
                alert('연간차트 가져오기를 실패하였습니다.')
            }
        })  
    }, [])

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
                accessor: "win",
                Header: "W",
            },
            {
                accessor: "draw",
                Header: "D",
            },
            {
                accessor: "lose",
                Header: "L",
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
        return b.pts - a.pts || b.plays - a.plays;
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

    return <Table columns={columns} data={indexedData}/>;    
}

export default YearChartTable;