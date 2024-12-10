import React, { useState } from 'react';
import Axios from 'axios';
import { Button, List, Modal } from 'antd';
import groundJpg from './ground.jpg';
import list from './playerlist.jpg';
import profile1 from './profile/1.jpg'
import profile2 from './profile/2.jpg'
import profile3 from './profile/3.jpg'

function AttendancePage() {
    const all = [
        { id: 0, name: "김형철", image: profile1, num: 3 }, { id: 1, name: "송효석", image: profile1, num: 18 }, { id: 2, name: "박재범", image: profile1, num: 0 }, { id: 3, name: "권위준", image: profile1, num: 14 }, { id: 4, name: "신종은", image: profile1, num: 17 },
        { id: 5, name: "이정일", image: profile1, num: 77 }, { id: 6, name: "조돈휘", image: profile1, num: 77 }, { id: 7, name: "현종권", image: profile1, num: 8 }, { id: 8, name: "곽영래", image: profile1, num: 32 }, { id: 9, name: "정회화", image: profile1, num: 7 },
        { id: 10, name: "김상명", image: profile1, num: 52 }, { id: 11, name: "신종윤", image: profile1, num: 13 }, { id: 12, name: "임필우", image: profile1, num: 19 }, { id: 13, name: "이병철", image: profile1, num: 11 },
        { id: 14, name: "강동균", image: profile2, num: 6 }, { id: 15, name: "류희대", image: profile2, num: 16 }, { id: 16, name: "여성진", image: profile2, num: 99 }, { id: 17, name: "김영준", image: profile2, num: 1 }, { id: 18, name: "장효준", image: profile2, num: 6 },
        { id: 19, name: "정기택", image: profile2, num: 2 }, { id: 20, name: "김정민", image: profile2, num: 7 }, { id: 21, name: "정현준", image: profile2, num: 15 }, { id: 22, name: "김주환", image: profile2, num: 5 }, { id: 23, name: "이지철", image: profile2, num: 9 }, 
        { id: 24, name: "김진호", image: profile2, num: 7 }, { id: 25, name: "박진산", image: profile2, num: 17 }, { id: 26, name: "임다훈", image: profile2, num: 22 }, { id: 27, name: "강병준", image: profile3, num: 11 },{ id: 28, name: "박찬용", image: profile3, num: 30 },
        { id: 29, name: "이종범", image: profile3, num: 4 }, { id: 30, name: "박기환", image: profile3, num: 6 }, { id: 31, name: "정도식", image: profile3, num: 10 }, { id: 32, name: "이주은", image: profile3, num: 20 }, { id: 33, name: "권현택", image: profile3, num: 13 },
        { id: 34, name: "이성혁", image: profile3, num: 10 }, { id: 35, name: "이상욱", image: profile3, num: '00' }, { id: 36, name: "박준영", image: profile3, num: 27 },
        { id: 37, name: "윤한중", image: profile3, num: 12 }, { id: 38, name: "전지민", image: profile1, num: 0 }
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
                    <p>출석한 회원 수: {attendanceList.length}명</p>
                    <p>정말 등록하시겠습니까?</p>
                    <p>등록 이후에는 명단이 초기화 됩니다.</p>
                    <p>당일 최종 명단 등록할 때 사용을 권장합니다.</p>
                </div>
            ),
            okText: '등록',
            cancelText: '취소',
            onOk() {
                console.log('출석 명단 제출:', attendanceList);
                Axios.post('/api/record/plusPlays', { attendanceList })
                .then(response => {
                    console.log(response.data)
                    if(response.data.success) {
                        console.log('명단 등록에 성공하였습니다.')
                        setAttendanceList([]); // 출석 명단 초기화
                        setMembers(all); // 회원 리스트 초기화
                        window.location.reload();
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
        <div style={{ textAlign: 'center', minHeight: "100vh" }}>
            <div style={{ padding: "10px", backgroundImage: `url(${list})`, backgroundSize: 'cover' }}>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ color: "#fff", fontSize: "25px" }}>🙋‍♂{date.toLocaleDateString()} 출석체크🙋‍♂</h1>
                    <p style={{ fontSize: '11px', color: "#fff" }}>💡출석 체크 페이지에서는 당일 참석한 선수들을 체크하고 출석포인트를 기록합니다.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: "50vh" }}>
                    <h2 style={{ color: 'white', fontWeight: 'bold' }}>HABIBI FC PLAYER LIST</h2>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={members}
                        renderItem={member => (
                            <List.Item>
                                <Button onClick={() => handleAttendance(member)} style={{ width: '70px', height: '80px', borderRadius: '3px', fontSize: '12px' }}>
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <img src={member.image} alt={member.name} style={{ marginLeft: '-13px', width: '65px', height: '76px', objectFit: 'cover', borderRadius: '3px' }} />
                                    <span style={{ position: 'absolute', bottom: '10px', left: '-15%', transform: 'translateX(-50%)', color: 'black', fontSize: '18px', fontWeight: 'bold' }}>{member.num}</span>
                                    <span style={{ position: 'absolute', bottom: '-9px', left: '50%', transform: 'translateX(-50%)', color: 'black', fontSize: '15px', fontWeight: 'bold' }}>{member.name}</span>
                                </div>
                                </Button>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: "50vh", background: `url(${groundJpg})`, backgroundSize: 'cover', padding: '20px' }}>
                <h2 style={{ color: 'white' }}>TODAY'S PLAYER</h2>
                <List
                    grid={{ gutter: 10, column: 5 }}
                    dataSource={attendanceList}
                    renderItem={member => (
                        <List.Item>
                            <Button onClick={() => removeAttendance(member)} style={{ width: '70px', height: '80px', borderRadius: '3px', fontSize: '12px' }}>
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <img src={member.image} alt={member.name} style={{ marginLeft: '-13px', width: '65px', height: '76px', objectFit: 'cover', borderRadius: '3px' }} />
                                    <span style={{ position: 'absolute', bottom: '10px', left: '-15%', transform: 'translateX(-50%)', color: 'black', fontSize: '18px', fontWeight: 'bold' }}>{member.num}</span>
                                    <span style={{ position: 'absolute', bottom: '-9px', left: '50%', transform: 'translateX(-50%)', color: 'black', fontSize: '15px', fontWeight: 'bold' }}>{member.name}</span>
                                </div>
                            </Button>
                        </List.Item>
                    )}
                />
                <Button type="primary" onClick={submitAttendanceList} style={{ background: '#2a85fb', width: '105px', height: '45px', borderRadius: '6px', fontSize: '15px' }}>명단 등록</Button>
            </div>
        </div>
    );
};

export default AttendancePage;