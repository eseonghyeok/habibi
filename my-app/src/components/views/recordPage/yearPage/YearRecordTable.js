import React, { useEffect, useState, useMemo, useRef } from 'react'
import Axios from 'axios';
import Table from "../default/defaultYearRecordTable";

function YearChartTable() {
    const [Player, setPlayer] = useState([]);
    const [year, setYear] = useState(null);
    const years = useRef(['2025']);
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});

    useEffect(() => {
        async function checkDate() {
            try {
                const records = (await Axios.get('/api/records/type/year'));
                years.current = records.data.map((record) => record.date);
                setYear(years.current.at(-1));
            } catch (err) {
                alert('기록이 존재하지 않습니다.');
                window.location.reload();
            }
        }
        checkDate();
    }, []);

    useEffect(() => {
        async function getRecord() {
            if (!year) return;
            try {
                const record = await Axios.get(`/api/records/date/${year}`);
                setPlayer(record.data.result);
            } catch (err) {
                alert('연간차트 가져오기를 실패하였습니다.');
                window.location.reload();
            }
        }
        getRecord();
    }, [year]);

    useEffect(() => {
        // 해당 월 버튼을 스크롤 컨테이너의 중앙에 가깝게 위치시킵니다.
        if (!year) return;
        if (buttonRefs.current[year]) {
            buttonRefs.current[year].scrollIntoView({ inline: 'center', behavior: 'smooth' });
        }
    }, [year]);

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
                {years.current.map((y) => (
                    <button
                        key={y}
                        style={buttonStyle(year === y)}
                        onClick={() => setYear(y)}
                        ref={(el) => buttonRefs.current[y] = el}
                    >
                        {y}년
                    </button>
                ))}
            </div>
            <Table columns={columns} data={indexedData} />
        </div>
    );
}

export default YearChartTable;