import { useState, useEffect } from 'react'
import Axios from 'axios';
import { Button, Modal, Input, Form, DatePicker } from 'antd';
import dayjs from 'dayjs';

export const playerInfo = (player) => {
  const birth = player.metadata.birth.split('-');

  return (
    <div>
      {(player.metadata.alias && player.metadata.number) && (
        <>
          <p><span style={{ fontWeight: 'bolder' }}>{player.metadata.alias} ({player.metadata.number})</span></p>
          <br />
        </>
      )}
      <p><span style={{ fontWeight: 'bolder' }}>이름</span>: {player.name}</p>
      <p><span style={{ fontWeight: 'bolder' }}>생년월일</span>: {birth[0]}년 {birth[1]}월 {birth[2]}일</p>
      <p><span style={{ fontWeight: 'bolder' }}>전화번호</span>: {player.metadata.phone}</p>
      <br />
      { player.metadata.etc.map(item => <p key={item.key}><span style={{ fontWeight: 'bolder' }}>{item.key}</span>: {item.value}</p>) }
    </div>
  );
};

export const getPlayerInfo = (player) => {
  Modal.info({
    title: '선수 정보',
    content: (
      <div>
        {playerInfo(player)}
      </div>
    ),
    okText: '확인'
  });
}

export const PlayerModal = ({ open, close, player, isLogin }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (player) {
      form.setFieldsValue({
        name: player.name || '',
        birth: dayjs(player.birth) || '',
        phone: player.phone || '',
        number: player.metadata.number || '',
        alias: player.metadata.alias || ''
      });
      form.setFieldsValue(player.metadata.etc.reduce((ret, item) => {
        ret[`etc.${item.key}`] = item.value;
        return ret;
      }, {}));
      setItems(player.metadata.etc.map(item => item.key));
    }
  }, [open, player, form]);
  
  const handleOk = async () => {
    let input = {}
    try {
      const items = await form.validateFields();
      input = {
        name: isLogin ? items.name : player.name,
        metadata: isLogin ? {
          birth: items.birth.format('YYYY-MM-DD'),
          phone: items.phone ? items.phone : '',
          number: items.number ? items.number : '',
          alias: items.alias ? items.alias : ''
        } : player.metadata
      }
      input.metadata.etc = Object.keys(items).filter(label => label.includes('etc.')).map(label => ({
        key: label.split('.')[1],
        value: items[label] ? items[label] : ''
      }));
    } catch {
      alert('필수 항목을 입력하세요.');
      return;
    }

    try {
      if (player) {
        await Axios.patch(`/api/players/id/${player.id}`, { ...input });
      } else {
        await Axios.post('/api/players', { ...input });
      }
      window.location.reload();
    } catch(err) {
      alert('선수 정보 수정하기를 실패하였습니다.');
      throw err;
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setItems([]);
    close();
  };

  const handleAddItem = () => {
    const label = prompt('추가할 항목 이름을 20자 이하의 한글 및 영문으로 입력하세요');
    if ((label === null) || (label.trim() === '')) {
      return;
    } else if (!(/^[a-zA-Z가-힣]{1,20}$/.test(label))) {
      alert('20자 이하의 한글 및 영문자만 입력 가능합니다.');
      return;
    } else if (items.includes(label)) {
      alert('이미 존재하는 항목입니다.');
      return;
    }
    setItems([...items, label]);
  };

  const handleRemoveItem = (label) => {
    setItems(items.filter((item) => item !== label));
    form.setFieldsValue({ [label]: undefined });
  };

  return (
    <Modal
      title={player ? isLogin ? '선수 수정' : '선수 정보' : '선수 추가'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={player ? '수정' : '추가'}
      cancelText='취소'
    >
      <Form form={form} layout="vertical">
        {(isLogin === 'true') ? (
          <>
            <Form.Item
              name="name"
              label="이름"
              rules={[{ required: true, message: '이름을 입력하세요' }]}
            >
              <Input
                maxLength={20}
              />
            </Form.Item>
            <Form.Item
              name="birth"
              label="생년월일"
              rules={[{ required: true, message: '생년월일을 입력하세요' }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label="전화번호"
              rules={[{ required: true, message: '전화번호를 입력하세요' }]}
            >
              <Input
                inputMode="numeric"
                maxLength={15}
                placeholder="숫자만 입력 가능합니다."
                onChange={(e) => {
                  form.setFieldsValue({ phone: e.target.value.replace(/\D/g, '') });
                }}
              />
            </Form.Item>
            <Form.Item
              name="number"
              label="유니폼 번호"
            >
              <Input
                inputMode="numeric"
                maxLength={3}
                placeholder="숫자만 입력 가능합니다."
                onChange={(e) => {
                  form.setFieldsValue({ number: e.target.value.replace(/\D/g, '') });
                }}
              />
            </Form.Item>
            <Form.Item
              name="alias"
              label="유니폼 이름"
            >
              <Input
                maxLength={20}
              />
            </Form.Item>
          </>
        ) : (player) && (
          playerInfo(player)
        )}

        {items.map((label) => (
          <Form.Item
            key={label}
            name={`etc.${label}`}
            label={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{label}</span>
                <Button
                  type="primary"
                  style={{ background: '#dc3545', marginLeft: '10px' }}
                  onClick={() => handleRemoveItem(label)}
                >
                  삭제
                </Button>
              </div>
            }
          >
            <Input />
          </Form.Item>
        ))}

        <Form.Item>
          <Button
            type="primary"
            style={{ background: '#28a745' }}
            onClick={handleAddItem}
          >
            항목 추가
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};