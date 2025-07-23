const express = require('express');
const router = express.Router();
const utils = require('../../common/utils');
const { Sequelize, sequelize, Record, Team } = require('../../common/models/index');


// 기록 조회
router.get('/date/:date', async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.date);

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
router.get('/type/:type/date/:date', async (req, res) => {
  try {
    const record = await Record.findAll({
      where: {
        type: req.params.type,
        date: {
          [Sequelize.Op.like]: `${req.params.date}%`
        }
      },
      order: [[ "date", 'ASC' ]]
    });

    res.json(record);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get('/last', async (req, res) => {
  try {
    const record = await Record.findOne({
      where: {
        type: 'day'
      },
      order: [[ "date", 'DESC' ]]
    });

    res.json(record);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 기록 추가
router.post('/date/:date', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      return Record.create({
        date: req.params.date,
        type: 'day',
        result: {},
        metadata: {
          log: {}
        }
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

// 기록 내용 변경
router.patch('/date/:date', async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.date);
    utils.setResult(record.date, record.metadata.log);

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.patch('/date/:date/log', async (req, res) => {
  try {
    const { match, log } = req.body;

    await sequelize.transaction(async (t) => {
      const record = await Record.findByPk(req.params.date);
      record.metadata.log[match] = log;
      record.changed('metadata', true);
      await record.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.patch('/date/:date/log/delete', async (req, res) => {
  try {
    const { match } = req.body;

    await sequelize.transaction(async (t) => {
      const record = await Record.findByPk(req.params.date);
      delete record.metadata.log[match];
      record.changed('metadata', true);
      await record.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;