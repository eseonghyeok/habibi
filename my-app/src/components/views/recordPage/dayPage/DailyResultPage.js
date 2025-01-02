import React, { useEffect, useState, useMemo } from 'react'
import Axios from 'axios';
import Table from "../default/defaultDailyResultTable";

function DailyResultPage() {
    const [Player, setPlayer] = useState([]);

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
                accessor: "pts",
                Header: "PTS",
            },
        ], []
    );
    let filteredData = Player.filter(player => player.attendance > 0);
    let filteredIds = filteredData.map(player => player.id);

    let Data = filteredData.sort(function(a, b) {
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

    return <Table columns={columns} data={indexedData} filteredIds={filteredIds}/>;
}

export default DailyResultPage;