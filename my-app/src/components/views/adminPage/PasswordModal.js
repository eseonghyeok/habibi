import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

function PasswordModal({ visible, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const DEFAULT_PASSWD = '1541'

  const loginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/';
  }

  const handleSubmit = () => {
    form.validateFields()
      .then(res => {
        setLoading(true);
        if (res.password === DEFAULT_PASSWD) {
          //성공시 매니저모드 진입
          loginSuccess();
        } else {
          alert('비밀번호가 일치하지 않습니다.')
        }
        setTimeout(() => {
          setLoading(false);
          onCancel();
        }, 1000);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Modal
      title="비밀번호 입력"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>취소</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>확인</Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="password"
          label="매니저 암호 (분실 시 이성혁에게 문의)"
          rules={[
            { required: true, message: '비밀번호를 입력하세요' }
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PasswordModal;