import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Input, Checkbox } from 'antd';
import backgroud from '../../images/noti.jpg'

const { TextArea } = Input;

function SuggestionPage() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [content, setContent] = useState('');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (isLoggedIn) {
      loadSuggestions();
    }
  }, [isLoggedIn]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const suggestionsData = (await Axios.get(`/api/suggestions`)).data;
      setSuggestions(suggestionsData);
    } catch (err) {
      alert('건의사항 가져오기를 실패하였습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('건의사항을 입력해주세요.');
      return;
    }

    try {
      await Axios.post(`/api/suggestions`, {
        content: content.trim()
      });
      setContent('');
      alert('건의사항이 등록되었습니다. 감사합니다!');
    } catch (err) {
      alert('건의사항 등록에 실패했습니다.');
      console.error(err);
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
      console.error(err);
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
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    console.log(dateString)
    const date = new Date(dateString);
    console.log(date)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'left', backgroundImage: `url(${backgroud})`, backgroundColor: '#FAF9F6', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ marginBottom: "10px", color: "white", fontSize: "34px" }}>🙋하비비 건의사항🙋</h1>
      
      {!isLoggedIn ? (
        <div>
          <p style={{ fontSize: '15px', color: "#fff", marginBottom: '20px' }}>💡건의사항을 자유롭게 작성해주세요. 건의사항은 익명이며 운영진이 검토 후 답변드리겠습니다.</p>
          <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', marginTop: '20px', borderRadius: '5px', padding: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>건의사항</label>
              <TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="건의사항을 입력해주세요"
                rows={15}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                onClick={handleSubmit}
              >
                제출
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '15px', color: "#fff", marginBottom: '20px' }}>💡등록된 건의사항을 확인하고 처리 상태를 관리할 수 있습니다.</p>
          {loading ? (
            <p>⏳ loading...</p>
          ) : (
            <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', marginTop: '20px', borderRadius: '5px', padding: '20px' }}>
              {suggestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                  등록된 건의사항이 없습니다.
                </div>
              ) : (
                <div>
                  {suggestions.map((suggestion) => (
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
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '10px', backgroundColor: '#fafafa', borderRadius: '3px' }}>
                        {suggestion.content}
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

