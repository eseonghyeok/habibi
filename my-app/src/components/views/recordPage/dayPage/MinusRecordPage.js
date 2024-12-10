import React, { useEffect, useState, useMemo } from 'react'
import Axios from 'axios';
import Table from '../default/defaultMinusRecordTable'

function MinusChartTable() {
    const [Player, setPlayer] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => { 
        Axios.get('/api/record/getDaily')
        .then(response => {
            console.log(response.data)
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
        ], []
    );

    let Data = Player.sort(function(a, b) {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.win !== a.win) return b.win - a.win;
        if (b.draw !== a.draw) return b.draw - a.draw;
        return b.lose - a.lose;
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
    
    if (isLoggedIn) {
        return <Table columns={columns} data={indexedData} />;
    } else {
        alert('매니저모드에서만 지원합니다.');
        window.location.href = '/';
        return null;
    }
}

export default MinusChartTable;