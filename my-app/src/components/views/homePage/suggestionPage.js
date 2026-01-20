import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Input, Checkbox } from 'antd';
import backgroud from '../../images/noti.jpg'

const { TextArea } = Input;

function SuggestionPage() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const suggestionsData = (await Axios.get(`/api/suggestions`)).data;
      setSuggestions(suggestionsData);
    } catch (err) {
      alert('건의사항 가져오기를 실패하였습니다.');
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert('건의사항을 입력해주세요.');
      return;
    }
    if (!name.trim()) {
      alert('작성자를 입력해주세요.');
      return;
    }

    try {
      await Axios.post(`/api/suggestions`, {
        content: {
          message: message.trim(),
          name: name.trim()
        }
      });
      alert('건의사항이 등록되었습니다. 감사합니다!');
    } catch (err) {
      alert('건의사항 등록에 실패했습니다.');
    } finally {
      window.location.reload();
    }
  };

  const handleCheckToggle = async (id, currentCheck) => {
    try {
      await Axios.patch(`/api/suggestions/id/${id}`, {
        check: !currentCheck
      });
      await loadSuggestions();
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
      window.location.reload();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await Axios.delete(`/api/suggestions/id/${id}`);
      await loadSuggestions();
    } catch (err) {
      alert('건의사항 삭제에 실패했습니다.');
      window.location.reload();
    }
  };

  const formatDate = (dateString) => {
    console.log(dateString)
    const date = new Date(dateString);
    console.log(date)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${backgroud})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "10px", color: "white", fontSize: "34px" }}>💬건의사항💬</h1>
        {isLoggedIn ? (
          <p style={{ fontSize: '15px', color: "#fff", marginBottom: '20px' }}>💡등록된 건의사항을 확인하고 처리 상태를 관리할 수 있습니다.</p>
        ) : (
          <p style={{ fontSize: '15px', color: "#fff", marginBottom: '20px' }}>💡건의사항을 자유롭게 작성해주세요. 건의사항의 작성자는 운영진에게만 보이며 운영진이 검토 후 답변드리겠습니다.</p>
        )}
      </div>
      
      {!isLoggedIn && (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', marginTop: '20px', borderRadius: '5px', padding: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>건의사항</label>
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="건의사항을 입력해주세요"
              rows={15}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'right' }}>
            <TextArea style={{ width: "100px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="작성자"
              rows={1}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
            >
              제출
            </Button>
          </div>
        </div>
      )}
      {loading ? (
        <p>⏳ loading...</p>
      ) : (
        <div>
          {!isLoggedIn && (
            <div style={{ marginTop: '20px' }}>
              <hr />
              <button onClick={() => setIsOpen(prev => !prev)}>
                {isOpen ? "건의사항 닫기" : "건의사항 보기"}
              </button>
            </div>
          )}
          {isOpen && (
            <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', marginTop: '20px', borderRadius: '5px', padding: '20px' }}>
              {suggestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                  등록된 건의사항이 없습니다.
                </div>
              ) : (
                <div>
                  {suggestions.filter(suggestion => isLoggedIn || !suggestion.check).map((suggestion) => (
                    <div
                      key={suggestion.id}
                      style={{
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: suggestion.check ? '#e6f7ff' : '#fff',
                        border: `1px solid ${suggestion.check ? '#1890ff' : '#d9d9d9'}`,
                        borderRadius: '5px'
                      }}
                    >
                      {isLoggedIn && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Checkbox
                              checked={suggestion.check}
                              onChange={() => handleCheckToggle(suggestion.id, suggestion.check)}
                            >
                              <span style={{ fontWeight: 'bold' }}>{suggestion.check ? '처리 완료' : '처리 대기'}</span>
                            </Checkbox>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#999' }}>
                              {formatDate(suggestion.createdAt)}
                            </span>
                            <Button
                              type="primary"
                              danger
                              size="small"
                              onClick={() => handleDelete(suggestion.id)}
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '10px', backgroundColor: '#fafafa', borderRadius: '3px' }}>
                        {isLoggedIn && (
                          <div>
                            <strong>작성자:</strong> {suggestion.content.name}
                            <br /><br />
                          </div>
                        )}
                        {suggestion.content.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SuggestionPage;

