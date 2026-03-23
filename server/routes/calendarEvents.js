const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const { sequelize, Calendar } = require('../../common/models/index');

const CATEGORIES = ['soccer', 'etc'];
const emptyContent = () => ({ soccer: [], etc: [] });

// 월 일정 조회 (date: YYYY-MM)
router.get('/date/:date', async (req, res) => {
  try {
    const record = await Calendar.findByPk(req.params.date);
    res.json(record || { date: req.params.date, content: emptyContent() });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 항목 추가 { category, day, title, time, place, content }
router.post('/date/:date/item', async (req, res) => {
  try {
    const { category, day, title, time, place, content: itemContent } = req.body;
    if (!CATEGORIES.includes(category)) return res.sendStatus(400);

    await sequelize.transaction(async (t) => {
      let record = await Calendar.findByPk(req.params.date, { transaction: t });
      if (!record) {
        record = await Calendar.create(
          { date: req.params.date, content: emptyContent() },
          { transaction: t }
        );
      }

      const content = { ...emptyContent(), ...record.content };
      content[category] = [
        ...(content[category] || []),
        { id: randomUUID(), day: Number(day), title, time, place: place || '', content: itemContent || '' }
      ];
      await record.update({ content }, { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 항목 수정 { title, time, place, content }
router.patch('/date/:date/item/:category/:id', async (req, res) => {
  try {
    const { title, time, place, content: itemContent } = req.body;
    const { date, category, id } = req.params;
    if (!CATEGORIES.includes(category)) return res.sendStatus(400);

    await sequelize.transaction(async (t) => {
      const record = await Calendar.findByPk(date, { transaction: t });
      if (!record) return res.sendStatus(404);

      const content = { ...record.content };
      content[category] = (content[category] || []).map(item =>
        item.id === id ? { ...item, title, time, place: place || '', content: itemContent || '' } : item
      );
      await record.update({ content }, { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 항목 삭제
router.delete('/date/:date/item/:category/:id', async (req, res) => {
  try {
    const { date, category, id } = req.params;
    if (!CATEGORIES.includes(category)) return res.sendStatus(400);

    await sequelize.transaction(async (t) => {
      const record = await Calendar.findByPk(date, { transaction: t });
      if (!record) return res.sendStatus(404);

      const content = { ...record.content };
      content[category] = (content[category] || []).filter(item => item.id !== id);
      await record.update({ content }, { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
