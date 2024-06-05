import React, { useEffect, useState, useMemo } from 'react'
import Axios from 'axios';
import Table from "../default/defaultDailyTable";

function DailyChartTable() {
    const [Player, setPlayer] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => { 
        Axios.get('/api/chart/daily')
        .then(response => {
            if(response.data.success) {
                setPlayer(response.data.dailyChart.players);
            } else {
                alert('일간차트 가져오기를 실패하였습니다.')
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
        ], []
    );

    let Data = Player.sort(function(a, b) {
        return (b.goal + b.assist) - (a.goal + a.assist); // 내림차순 정렬
    });
    
    let playerRank = 0;
    let indexedData = Data.map((item, index, array) => {
        if (index > 0 && (array[index].goal + array[index].assist) === (array[index - 1].goal + array[index - 1].assist)) {
            return { ...item, rank: playerRank };
        } else {
            playerRank ++;
            return { ...item, rank: playerRank };
        }
    });
    
    if (isLoggedIn) {
        return <Table columns={columns} data={indexedData} />;
    } else {
        alert('매니저모드에서만 지원합니다.');
        window.location.href = '/';
        return null;
    }
}

export default DailyChartTable;