import React, { useState, useEffect, useRef } from 'react';
import { Modal, Calendar, List, Button, Input, Space, Typography, Divider, Select, Form, TimePicker } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import Axios from 'axios';
import dayjs from 'dayjs';

const CATEGORIES = [
  { key: 'soccer', label: '⚽ 축구' },
  { key: 'etc',    label: '📌 기타' },
];

const CATEGORY_EMOJI = { soccer: '⚽', etc: '📌' };
const SOCCER_DEFAULTS = { title: '자체전', place: '영등포 공원' };

function ScheduleFormFields() {
  return (
    <>
      <Form.Item
        name="title"
        label="제목"
        rules={[
          { required: true, message: '제목을 입력하세요' },
          { max: 10, message: '10글자 이내로 입력하세요' },
        ]}
      >
        <Input maxLength={10} showCount />
      </Form.Item>

      <Form.Item label="시간" required style={{ marginBottom: 8 }}>
        <Space>
          <Form.Item
            name="timeStart"
            noStyle
            rules={[{ required: true, message: '시작 시간을 입력하세요' }]}
          >
            <TimePicker format="HH:mm" minuteStep={5} placeholder="시작" inputReadOnly />
          </Form.Item>
          <span>~</span>
          <Form.Item
            name="timeEnd"
            noStyle
            dependencies={['timeStart']}
            rules={[
              { required: true, message: '종료 시간을 입력하세요' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const start = getFieldValue('timeStart');
                  if (!value || !start || value.isAfter(start)) return Promise.resolve();
                  return Promise.reject(new Error('종료 시간은 시작 시간보다 커야 합니다'));
                },
              }),
            ]}
          >
            <TimePicker format="HH:mm" minuteStep={5} placeholder="종료" inputReadOnly />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item
        name="place"
        label="장소"
        rules={[{ max: 20, message: '20글자 이내로 입력하세요' }]}
      >
        <Input maxLength={20} showCount />
      </Form.Item>

      <Form.Item
        name="content"
        label="내용"
        rules={[{ max: 50, message: '50글자 이내로 입력하세요' }]}
      >
        <Input.TextArea maxLength={50} showCount autoSize={{ minRows: 2 }} />
      </Form.Item>
    </>
  );
}

function CalendarModal({ open, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [players, setPlayers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addCategory, setAddCategory] = useState('soccer');
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [calendarKey, setCalendarKey] = useState(0);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const calendarCacheRef = useRef({});
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (open) {
      setCurrentMonth(dayjs());
      Axios.get('/api/players').then(res => setPlayers(res.data)).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (open) loadMonthRecord(currentMonth);
  }, [open, currentMonth]);

  const loadMonthRecord = async (month) => {
    try {
      const months = [month.subtract(1, 'month'), month, month.add(1, 'month')];
      const results = await Promise.allSettled(
        months.map(m => Axios.get(`/api/calendars/date/${m.format('YYYY-MM')}`))
      );
      months.forEach((m, i) => {
        calendarCacheRef.current[m.format('YYYY-MM')] =
          results[i].status === 'fulfilled' ? (results[i].value.data?.content ?? null) : null;
      });
    } finally {
      setCalendarKey(k => k + 1);
    }
  };

  const reloadMonth = () => loadMonthRecord(currentMonth);

  const showMonthSchedule = () => {
    const month = currentMonth.format('MM');
    const content = calendarCacheRef.current[currentMonth.format('YYYY-MM')];
    const sortByDay = arr => [...arr].sort((a, b) => a.day - b.day);
    const soccerEvents = sortByDay(content?.soccer || []);
    const etcEvents = sortByDay(
      Object.entries(content || {}).filter(([k]) => k !== 'soccer').flatMap(([, v]) => v)
    );
    const birthdayPlayers = players
      .filter(p => p.metadata?.birth?.slice(5, 7) === month)
      .sort((a, b) => a.metadata.birth.slice(8, 10).localeCompare(b.metadata.birth.slice(8, 10)));
    const renderEvents = (events) =>
      events.length === 0
        ? <p style={{ color: '#999' }}>일정 없음</p>
        : events.map(event => (
          <p key={event.id}>
            <span>{month}월 {event.day}일</span>
            {event.time && <span> {event.time}</span>}
            {' / '}
            <span style={{ fontWeight: 'bold' }}>{event.title}</span>
            {event.place && <span style={{ color: '#666' }}> ({event.place})</span>}
          </p>
        ));
    Modal.info({
      title: `${currentMonth.format('YYYY년 MM월')} 일정`,
      icon: '📅',
      okText: '확인',
      content: (
        <div>
          <p style={{ fontWeight: 'bolder' }}>🎉 생일자 목록</p>
          {birthdayPlayers.length === 0
            ? <p style={{ color: '#999' }}>생일자 없음</p>
            : birthdayPlayers.map(player => (
              <p key={player.id}>
                <span>{month}월 {player.metadata.birth.slice(8, 10)}일 / </span>
                <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                {(player.metadata.alias && player.metadata.number) && (
                  <span>, {player.metadata.alias}({player.metadata.number})</span>
                )}
              </p>
            ))
          }
          <br />
          <p style={{ fontWeight: 'bolder' }}>⚽ 축구 일정</p>
          {renderEvents(soccerEvents)}
          <br />
          <p style={{ fontWeight: 'bolder' }}>📌 기타 일정</p>
          {renderEvents(etcEvents)}
        </div>
      ),
    });
  };

  // 추가 폼 열리거나 카테고리가 soccer로 바뀔 때 기본값 세팅
  useEffect(() => {
    if (isAdding && addCategory === 'soccer') {
      addForm.setFieldsValue(SOCCER_DEFAULTS);
    }
  }, [isAdding, addCategory, addForm]);

  const getBirthdaysForDay = (date) => {
    const mmdd = date.format('MM-DD');
    return players.filter(p => p.metadata?.birth?.slice(5, 10) === mmdd);
  };

  const getEventsForDay = (date) => {
    const content = calendarCacheRef.current[date.format('YYYY-MM')];
    if (!content) return {};
    const day = date.date();
    const result = {};
    CATEGORIES.forEach(({ key }) => {
      const items = (content[key] || []).filter(item => item.day === day);
      if (items.length > 0) result[key] = items;
    });
    return result;
  };

  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    const birthdays = getBirthdaysForDay(current);
    const events = getEventsForDay(current);
    const hasAny = birthdays.length > 0 || Object.keys(events).length > 0;
    return (
      <div style={{ textAlign: 'center' }}>
        <div>{current.date()}</div>
        {hasAny && (
          <div style={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', marginTop: 1 }}>
            {birthdays.length > 0 && <span style={{ fontSize: 10 }}>🎂</span>}
            {CATEGORIES.map(({ key }) => events[key] && <span key={key} style={{ fontSize: 10 }}>{CATEGORY_EMOJI[key]}</span>)}
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date, { source }) => {
    if (source !== 'date') return;
    setSelectedDay(date);
    // 클릭한 날짜의 월이 currentMonth와 다를 때 동기화 (overflow 날짜 클릭 대응)
    if (!date.isSame(currentMonth, 'month')) {
      setCurrentMonth(date.startOf('month'));
    }
    setIsAdding(false);
    addForm.resetFields();
    setAddCategory('soccer');
    setDetailOpen(true);
  };

  const handleAdd = async () => {
    if (isSaving) return;
    try {
      const values = await addForm.validateFields();
      setIsSaving(true);
      // currentMonth 대신 selectedDay 기준으로 월 키 결정 (월 불일치 방지)
      await Axios.post(`/api/calendars/date/${selectedDay.format('YYYY-MM')}/item`, {
        category: addCategory,
        day: selectedDay.date(),
        title: values.title,
        time: `${values.timeStart.format('HH:mm')} ~ ${values.timeEnd.format('HH:mm')}`,
        place: values.place || '',
        content: values.content || '',
      });
      addForm.resetFields();
      setIsAdding(false);
      await reloadMonth();
    } catch (err) {
      if (err?.errorFields) return;
      alert('일정 추가에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditOpen = (item) => {
    setEditItem(item);
    const [start, end] = (item.time || '').split(' ~ ');
    editForm.setFieldsValue({
      title: item.title,
      timeStart: start ? dayjs(start, 'HH:mm') : null,
      timeEnd: end ? dayjs(end, 'HH:mm') : null,
      place: item.place,
      content: item.content,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      await Axios.patch(
        `/api/calendars/date/${currentMonth.format('YYYY-MM')}/item/${editItem.category}/${editItem.id}`,
        {
          title: values.title,
          time: `${values.timeStart.format('HH:mm')} ~ ${values.timeEnd.format('HH:mm')}`,
          place: values.place || '',
          content: values.content || '',
        }
      );
      setEditOpen(false);
      setEditItem(null);
      await reloadMonth();
    } catch (err) {
      if (err?.errorFields) return;
      alert('일정 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (category, id) => {
    try {
      await Axios.delete(`/api/calendars/date/${currentMonth.format('YYYY-MM')}/item/${category}/${id}`);
      await reloadMonth();
    } catch {
      alert('일정 삭제에 실패했습니다.');
    }
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setIsAdding(false);
    addForm.resetFields();
  };

  const birthdays = selectedDay ? getBirthdaysForDay(selectedDay) : [];
  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : {};
  const eventRows = CATEGORIES.flatMap(({ key }) =>
    (dayEvents[key] || []).map(item => ({ ...item, category: key }))
  );

  return (
    <>
      {/* 메인 달력 모달 */}
      <Modal title="📅 달력" open={open} onCancel={onClose} footer={null} width={380} destroyOnClose>
        <style>{`
          .habibi-calendar .ant-picker-calendar-date-value { display: none; }
          .habibi-calendar .ant-picker-cell-inner.ant-picker-calendar-date { overflow: visible !important; height: auto !important; min-height: 24px; }
          .habibi-calendar .ant-picker-calendar-date-content { overflow: visible !important; height: auto !important; }
        `}</style>
        <div className="habibi-calendar">
          <Calendar
            key={calendarKey}
            defaultValue={currentMonth}
            fullscreen={false}
            cellRender={cellRender}
            onSelect={handleDateSelect}
            mode="month"
            headerRender={({ value, onChange }) => {
              const prev = () => { const m = value.subtract(1, 'month'); onChange(m); setCurrentMonth(m); };
              const next = () => { const m = value.add(1, 'month'); onChange(m); setCurrentMonth(m); };
              const yearOptions = Array.from({ length: 11 }, (_, i) => {
                const y = dayjs().year() - 5 + i;
                return { value: y, label: `${y}년` };
              });
              const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` }));
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <Button type="text" icon={<LeftOutlined />} onClick={prev} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Select value={value.year()} size="small" options={yearOptions} style={{ width: 88 }}
                      onChange={(y) => { const m = value.year(y); onChange(m); setCurrentMonth(m); }} />
                    <Select value={value.month() + 1} size="small" options={monthOptions} style={{ width: 68 }}
                      onChange={(mo) => { const m = value.month(mo - 1); onChange(m); setCurrentMonth(m); }} />
                  </div>
                  <Button type="text" icon={<RightOutlined />} onClick={next} />
                </div>
              );
            }}
          />
        </div>
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <Button size="small" onClick={showMonthSchedule}>
            {currentMonth.format('MM')}월 일정 보기
          </Button>
        </div>
      </Modal>

      {/* 날짜 상세 모달 */}
      <Modal
        title={selectedDay ? `📅 ${selectedDay.format('YYYY년 MM월 DD일')}` : ''}
        open={detailOpen}
        onCancel={handleDetailClose}
        footer={null}
        width={460}
        destroyOnClose
      >
        {/* 생일 섹션 */}
        {birthdays.length > 0 && (
          <>
            <Typography.Text strong>🎂 생일</Typography.Text>
            <div style={{ marginTop: 6, marginBottom: 4 }}>
              {birthdays.map(p => (
                <div key={p.id} style={{ paddingLeft: 8, marginBottom: 2 }}>
                  {p.name}
                  {p.metadata.alias && p.metadata.number && (
                    <span style={{ color: '#888', marginLeft: 6 }}>({p.metadata.alias} / {p.metadata.number})</span>
                  )}
                </div>
              ))}
            </div>
            <Divider style={{ margin: '12px 0' }} />
          </>
        )}

        {/* 일정 섹션 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Typography.Text strong>📋 일정</Typography.Text>
          {isLoggedIn && !isAdding && (
            <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => setIsAdding(true)}>추가</Button>
          )}
        </div>

        {/* 추가 폼 */}
        {isAdding && (
          <div style={{ marginBottom: 12, padding: '12px 16px', background: '#fafafa', borderRadius: 6 }}>
            <Select
              value={addCategory}
              onChange={(val) => {
                setAddCategory(val);
                addForm.resetFields();
                if (val === 'soccer') addForm.setFieldsValue(SOCCER_DEFAULTS);
              }}
              style={{ width: '100%', marginBottom: 12 }}
              options={CATEGORIES.map(c => ({ value: c.key, label: c.label }))}
            />
            <Form form={addForm} layout="vertical" size="small">
              <ScheduleFormFields />
            </Form>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
              <Button onClick={() => { setIsAdding(false); addForm.resetFields(); }}>취소</Button>
              <Button type="primary" onClick={handleAdd} loading={isSaving}>저장</Button>
            </div>
          </div>
        )}

        {/* 일정 목록 */}
        <List
          dataSource={eventRows}
          locale={{ emptyText: '등록된 일정이 없습니다.' }}
          renderItem={item => (
            <List.Item
              actions={isLoggedIn ? [
                <Button key="edit" size="small" icon={<EditOutlined />} onClick={() => handleEditOpen(item)} />,
                <Button key="delete" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item.category, item.id)} />,
              ] : []}
            >
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Space>
                  <span>{CATEGORY_EMOJI[item.category]}</span>
                  <Typography.Text strong>{item.title}</Typography.Text>
                  {item.time && <Typography.Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Typography.Text>}
                </Space>
                {(item.place || item.content) && (
                  <div style={{ paddingLeft: 22, fontSize: 12, color: '#555' }}>
                    {item.place && <span>{item.place}</span>}
                    {item.place && item.content && <span style={{ margin: '0 6px' }}>|</span>}
                    {item.content && <span>{item.content}</span>}
                  </div>
                )}
              </Space>
            </List.Item>
          )}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="일정 수정"
        open={editOpen}
        onOk={handleEdit}
        onCancel={() => { setEditOpen(false); setEditItem(null); }}
        okText="저장"
        cancelText="취소"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" size="small">
          <ScheduleFormFields />
        </Form>
      </Modal>
    </>
  );
}

export default CalendarModal;
