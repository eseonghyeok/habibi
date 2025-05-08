import React, { useEffect, useState, useMemo, useRef } from 'react';
import Axios from 'axios';
import Table from "../default/defaultMonthRecordTable";

function MonthChartTable() {
    const [Player, setPlayer] = useState([]);
    const [month, setMonth] = useState('5');
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});

    useEffect(() => { 
        Axios.get(`/api/record/getMonth/${month}`)
        .then(response => {
            if(response.data.success) {
                if (response.data.monthChart) {
                    setPlayer(response.data.monthChart.players);
                } else {
                    setPlayer(response.data.otherChart.players);
                }
            } else {
                alert('월간차트 가져오기를 실패하였습니다.');
                window.location.reload();
            }
        })  
    }, [month]);

    useEffect(() => {
        // 해당 월 버튼을 스크롤 컨테이너의 중앙에 가깝게 위치시킵니다.
        if (buttonRefs.current[month]) {
            buttonRefs.current[month].scrollIntoView({ inline: 'center', behavior: 'smooth' });
        }
    }, [month]);

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

    const buttonStyle = (isActive) => ({
        marginRight: '10px',
        padding: '10px 20px',
        border: 'none',
        backgroundColor: isActive ? '#007bff' : 'rgb(227 227 227)',
        color: isActive ? 'white' : 'black',
        cursor: 'pointer',
        fontSize: '16px'
    });

    const scrollContainerStyle = {
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        backgroundColor: 'yellow',
        padding: '10px 0'
    };

    return (
        <div>
            <div style={scrollContainerStyle} ref={scrollRef}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => (
                    <button
                        key={m}
                        style={buttonStyle(month === m)}
                        onClick={() => setMonth(m)}
                        ref={(el) => buttonRefs.current[m] = el}
                    >
                        {m}월
                    </button>
                ))}
            </div>
            <Table columns={columns} data={indexedData} />
        </div>
    );
}

export default MonthChartTable;
