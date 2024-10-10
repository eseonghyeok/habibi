import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function LogPage() {
    const [displayLog, setDisplayLog] = useState([]); // 배열로 초기화

    useEffect(() => { 
        Axios.get('/api/chart/log')
        .then(response => {
            if (response.data.success) {
                const logs = response.data.logPage;
                if (Array.isArray(logs)) {
                    setDisplayLog(logs);
                } else {
                    console.error('로그 데이터 형식이 잘못되었습니다.');
                }
            } else {
                alert('로그 가져오기를 실패하였습니다.');
            }
        })
        .catch(error => {
            console.error('Error fetching log:', error);
        }); 
    }, []);

    return (
        <div style={{ 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '100vh', 
            color: 'white', 
            padding: '20px' 
        }}>
            <h1>로그 페이지</h1>
            <div style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: '8px', 
                padding: '15px',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <pre>
                    {displayLog.map((item, index) => (
                        <div key={index}>
                            {item.log}
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
}

export default LogPage;
