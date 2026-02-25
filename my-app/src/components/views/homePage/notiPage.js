import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Input } from 'antd';
import backgroud from '../../images/noti.jpg'

const { TextArea } = Input;

function NotiPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    async function getNotifications() {
      setLoading(true);
      try {
        const notificationsData = (await Axios.get(`/api/notifications`)).data;
        setNotifications(notificationsData);
        if (notificationsData.length > 0) {
          setActiveTab(notificationsData[0].title);
        }
      } catch (err) {
        alert('공지사항 가져오기를 실패하였습니다.');
        window.location.reload();
        throw err;
      } finally {
        setLoading(false);
      }
    }
    getNotifications();
  }, []);

  const buttonStyle = {
    backgroundColor: '#ff0',
    color: 'black',
    textAlign: 'center',
    margin: '10px',
    borderRadius: '5px',
    borderColor: '#ff0',
    cursor: 'pointer',
    padding: '8px'
  };

  if (loading) return <p>⏳ loading...</p>;

  return (
    <div style={{ textAlign: 'left', backgroundImage: `url(${backgroud})`, backgroundColor: '#FAF9F6', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "10px" }}>
        <h1 style={{ margin: 0, color: "white", fontSize: "34px" }}>공지사항</h1>
        {isLoggedIn && (
          <Button
            type="primary"
            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
            onClick={() => {
              setIsAdding(true);
              setIsEditing(false);
              setEditTitle('');
              setEditContent('');
              setActiveTab(null);
            }}
          >
            추가
          </Button>
        )}
      </div>
      <p style={{ fontSize: '15px', color: "#fff" }}>💡궁금하신 문의사항은 운영진에게 연락바랍니다.</p>
      <div style={{ marginBottom: '20px' }}>
        {notifications.map((notification) => (
          <button
            key={notification.title}
            style={{
              ...buttonStyle,
              backgroundColor: activeTab === notification.title ? '#007bff' : '#ff0',
              color: activeTab === notification.title ? 'white' : 'black'
            }}
            onClick={() => {
              setActiveTab(notification.title);
              setIsEditing(false);
              setIsAdding(false);
            }}
          >
            {notification.title}
          </button>
        ))}
      </div>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', marginTop: '20px', borderRadius: '5px', padding: '20px' }}>
        {isAdding ? (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>제목</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>내용</label>
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={15}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                style={{ marginRight: '10px' }}
                onClick={() => {
                  setIsAdding(false);
                  setEditTitle('');
                  setEditContent('');
                }}
              >
                취소
              </Button>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    // 제목 중복 체크
                    const duplicateNotification = notifications.find(
                      n => n.title === editTitle.trim()
                    );
                    
                    if (duplicateNotification) {
                      alert('동일한 제목의 공지사항이 이미 존재합니다.');
                      return;
                    }
                    
                    if (!editTitle.trim()) {
                      alert('제목을 입력해주세요.');
                      return;
                    }
                    
                    await Axios.post(`/api/notifications`, {
                      title: editTitle.trim(),
                      content: editContent
                    });
                    // 공지사항 목록 새로고침
                    const notificationsData = (await Axios.get(`/api/notifications`)).data;
                    setNotifications(notificationsData);
                    setIsAdding(false);
                    setEditTitle('');
                    setEditContent('');
                    if (notificationsData.length > 0) {
                      setActiveTab(editTitle.trim());
                    }
                    alert('공지사항이 추가되었습니다.');
                  } catch (err) {
                    if (err.response && err.response.status === 400) {
                      alert('동일한 제목의 공지사항이 이미 존재합니다.');
                    } else {
                      alert('공지사항 추가에 실패했습니다.');
                    }
                    console.error(err);
                  }
                }}
              >
                저장
              </Button>
            </div>
          </div>
        ) : activeTab !== null && notifications.find(n => n.title === activeTab) ? (
          <>
            {isLoggedIn && !isEditing && (
              <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                <Button
                  type="primary"
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    const currentNotification = notifications.find(n => n.title === activeTab);
                    setEditTitle(currentNotification.title);
                    setEditContent(currentNotification.content);
                    setIsEditing(true);
                    setIsAdding(false);
                  }}
                >
                  수정
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={async () => {
                    if (window.confirm('정말 삭제하시겠습니까?')) {
                      try {
                        const currentNotification = notifications.find(n => n.title === activeTab);
                        await Axios.delete(`/api/notifications/title/${encodeURIComponent(currentNotification.title)}`);
                        // 공지사항 목록 새로고침
                        const notificationsData = (await Axios.get(`/api/notifications`)).data;
                        setNotifications(notificationsData);
                        if (notificationsData.length > 0) {
                          setActiveTab(notificationsData[0].title);
                        } else {
                          setActiveTab(null);
                        }
                        alert('공지사항이 삭제되었습니다.');
                      } catch (err) {
                        alert('공지사항 삭제에 실패했습니다.');
                        console.error(err);
                      }
                    }
                  }}
                >
                  삭제
                </Button>
              </div>
            )}
            {isEditing ? (
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>제목</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>내용</label>
                  <TextArea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    rows={15}
                  />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Button
                    style={{ marginRight: '10px' }}
                    onClick={() => {
                      setIsEditing(false);
                      setIsAdding(false);
                      setEditTitle('');
                      setEditContent('');
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    type="primary"
                    onClick={async () => {
                      try {
                        const currentNotification = notifications.find(n => n.title === activeTab);
                        
                        // 제목 중복 체크 (현재 공지사항 제외)
                        const duplicateNotification = notifications.find(
                          n => n.title !== currentNotification.title && n.title === editTitle.trim()
                        );
                        
                        if (duplicateNotification) {
                          alert('동일한 제목의 공지사항이 이미 존재합니다.');
                          return;
                        }
                        
                        if (!editTitle.trim()) {
                          alert('제목을 입력해주세요.');
                          return;
                        }
                        
                        await Axios.patch(`/api/notifications/title/${encodeURIComponent(currentNotification.title)}`, {
                          title: editTitle.trim(),
                          content: editContent
                        });
                        // 공지사항 목록 새로고침
                        const notificationsData = (await Axios.get(`/api/notifications`)).data;
                        setNotifications(notificationsData);
                        setIsEditing(false);
                        setActiveTab(editTitle.trim());
                        alert('공지사항이 수정되었습니다.');
                      } catch (err) {
                        if (err.response && err.response.status === 400) {
                          alert('동일한 제목의 공지사항이 이미 존재합니다.');
                        } else {
                          alert('공지사항 수정에 실패했습니다.');
                        }
                        console.error(err);
                      }
                    }}
                  >
                    저장
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {notifications.find(n => n.title === activeTab).content}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default NotiPage;
