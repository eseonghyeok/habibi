import { useState } from 'react';
import Axios from 'axios';
import { Modal, Form, Input, InputNumber, Button } from 'antd'

const RankPolicyPage = ({ rankPolicy }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const showModal = () => {
      setIsModalOpen(true);
    };

    const handleOk = async () => {
      try {
        const values = await form.validateFields();
        
        isLoggedIn && await Axios.patch('/api/settings/name/rank', {
          content: { 
            num: values.num,
            month: String(values.month).padStart(2, '0'),
            text: values.text
          }
        });

        isLoggedIn ? window.location.reload() : setIsModalOpen(false);
      } catch (err) {
        console.log(err);
      }
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'yellow', padding: '5px' }}>
          <button 
            onClick={() => showModal()}>
            포상 정책
          </button>
        </div>

        <Modal
          title="포상 정책"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="확인"
          cancelText="취소"
          width={500}
          footer={isLoggedIn ? undefined : [<Button key="ok" type="primary" onClick={handleOk}>확인</Button>]}
        >
          { isLoggedIn ? (
            <Form
              form={form}
              layout="vertical"
              style={{ marginTop: 20 }}
              initialValues={rankPolicy}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item 
                  label="인원" 
                  name="num" 
                  rules={[{ required: true, message: '인원을 입력하세요' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={1} max={99} controls={false} addonAfter="명" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item 
                  label="주기" 
                  name="month" 
                  rules={[{ required: true, message: '주기를 입력하세요' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={1} max={12} controls={false} addonAfter="개월" style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <Form.Item 
                label="기준" 
                name="text" 
                rules={[{ required: true, message: '기준을 입력하세요' }]}
              >
                <Input.TextArea rows={4} placeholder="기준을 입력하세요" />
              </Form.Item>
            </Form>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px' }}>
              {rankPolicy.text}
            </div>
          )}
        </Modal>
      </>
    );
  };

export default RankPolicyPage;
