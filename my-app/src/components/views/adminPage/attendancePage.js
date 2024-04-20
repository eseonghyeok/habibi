import React, { useState } from 'react';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import groundJpg from './ground.jpg';
import banchJpg from './banch.jpg';
import background from '../chartPage/default/soccer_stadium.jpg';

function AttendancePage() {
    const all = [
        { id: 0, name: "김형철" }, { id: 1, name: "송효석" }, { id: 2, name: "박재범" }, { id: 3, name: "권위준" }, { id: 4, name: "신종은" },
        { id: 5, name: "이정일" }, { id: 6, name: "조돈휘" }, { id: 7, name: "현종권" }, { id: 8, name: "곽영래" }, { id: 9, name: "정회화" },
        { id: 10, name: "김상명" }, { id: 11, name: "신종윤" }, { id: 12, name: "임필우" }, { id: 13, name: "김명관" }, { id: 14, name: "이병철" },
        { id: 15, name: "강동균" }, { id: 16, name: "류희대" }, { id: 17, name: "여성진" }, { id: 18, name: "김영준" }, { id: 19, name: "장효준" },
        { id: 20, name: "정기택" }, { id: 21, name: "김정민" }, { id: 22, name: "김주환" }, { id: 23, name: "이지철" }, { id: 24, name: "김진호" },
        { id: 25, name: "박진산" }, { id: 26, name: "임다훈" }, { id: 27, name: "박찬용" }, { id: 28, name: "이종범" }, { id: 29, name: "박기환" },
        { id: 30, name: "이주은" }, { id: 31, name: "권현택" }, { id: 32, name: "민준홍" }, { id: 33, name: "이성혁" }, { id: 34, name: "이   정" },
        { id: 35, name: "이상욱" }, { id: 36, name: "박준영" }, { id: 37, name: "윤한중" }
    ];

    //회원 리스트
    const [members, setMembers] = useState(all);

    // 출석한 회원 명단
    const [attendanceList, setAttendanceList] = useState([]);

    // 출석 처리 함수
    const handleAttendance = (member) => {
        setAttendanceList([...attendanceList, member]);
        setMembers(members.filter((m) => m !== member));
    };

    // 출석 명단에서 회원 삭제 함수
    const removeAttendance = (member) => {
        setAttendanceList(attendanceList.filter((m) => m !== member));
        setMembers([...members, member]);
    };

    // 출석 명단을 서버로 제출하는 함수
    const submitAttendanceList = () => {
        Modal.confirm({
            title: '출석 명단 제출',
            content: (
                <div>
                    <p>정말 등록하시겠습니까?</p>
                    <p>등록 이후에는 명단이 초기화 됩니다.</p>
                    <p>당일 최종 명단 등록할 때 사용을 권장합니다.</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            onOk() {
                console.log('출석 명단 제출:', attendanceList);
                Axios.post('/api/chart/plusPlays', { attendanceList })
                .then(response => {
                    console.log(response.data)
                    if(response.data.success) {
                        console.log('명단 등록에 성공하였습니다.')
                        setAttendanceList([]); // 출석 명단 초기화
                        setMembers(all); // 회원 리스트 초기화
                    } else {
                        alert('명단 등록에 실패하였습니다.')
                    }
                })
            },
            onCancel() {
                console.log('취소됨');
            },
        });
    };

    let date = new Date();

    return (
        <div style={{ textAlign: 'center', minHeight: "100vh", padding: "20px", backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h1 style={{ marginBottom: "10px", marginRight: "40%", color: "#fff", fontSize: "50px" }}>{date.toLocaleDateString()}</h1>
                <h1 style={{ marginBottom: "10px", marginRight: "40%", color: "#fff", fontSize: "50px" }}>🙋‍♂출석체크🙋‍♂</h1>
                <p style={{ color: "#fff" }}>💡출석 체크 페이지에서는 당일 참석한 선수들을 체크하고 출석포인트를 기록합니다.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: "50vh", background: `url(${banchJpg})`, backgroundSize: 'cover', padding: '20px' }}>
                <h2 style={{ color: 'white' }}>회원 리스트</h2>
                <List
                    grid={{ gutter: 10, column: 8 }}
                    dataSource={members}
                    renderItem={member => (
                        <List.Item>
                            <Button onClick={() => handleAttendance(member)}>{member.name}</Button>
                        </List.Item>
                    )}
                />
            </div>
            <Button type="primary" onClick={submitAttendanceList}>명단 등록</Button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: "50vh", background: `url(${groundJpg})`, backgroundSize: 'cover', padding: '20px' }}>
                <h2 style={{ color: 'white' }}>출석 명단</h2>
                <List
                    grid={{ gutter: 10, column: 4 }}
                    dataSource={attendanceList}
                    renderItem={member => (
                        <List.Item>
                            <Button onClick={() => removeAttendance(member)}>{member.name}</Button>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default AttendancePage;