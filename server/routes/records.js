const express = require('express');
const router = express.Router();
const { sequelize, Sequelize, Player, Record } = require('../../common/models/index');


// 기록 조회
router.get('/', async (req, res) => {
  try {
    const records = await Record.findAll();

    res.json(records);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get('/date/:date', async (req, res) => {
  try {
    const record = await Record.findOne({
      where: {
        date: req.params.date
      }
    });

    res.json(record);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get('/type/:type', async (req, res) => {
  try {
    const record = await Record.findAll({
      where: {
        type: req.params.type
      },
      order: [[ "date", 'ASC' ]]
    });

    res.json(record);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 기록 추가
router.post('/', async (req, res) => {
  try {
    const { date, result } = req.body;

    await sequelize.transaction((t) => {
      return Record.create({
        date,
        type: 'day',
        result,
        metadata: {}
      },
      { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 기록 삭제
router.delete('/', async (req, res) => {
  try {
    await sequelize.transaction((t) => {
      Record.destroy({
        where: {},
        transaction: t
      });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.delete('/date/:date', async (req, res) => {
  try {
    await sequelize.transaction((t) => {
      return Record.destroy({
        where: {
          date: req.params.date
        },
        transaction: t
      });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 기록 날짜 변경
router.patch('/date/:date/info', async (req, res) => {
  try {
    const { date } = req.body;

    await sequelize.transaction(async (t) => {
      const record = await Record.findByPk(req.params.date);
      record.date = date;
      await record.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 기록 내용 변경
router.patch('/date/:date/info', async (req, res) => {
  try {
    const { result } = req.body;

    await sequelize.transaction(async (t) => {
      const record = await Record.findByPk(req.params.date);
      record.result = result;
      await record.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 마지막 기록 조회
router.get('/last', async (req, res) => {
  try {
    const record = await Record.findOne({
      where: { type: 'day' },
      order: [[ "date", 'DESC' ]]
    });

    res.json(record);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;