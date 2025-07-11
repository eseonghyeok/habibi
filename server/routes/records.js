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

    function addValue(result, input) {
      const keys = ['plays', 'matches', 'win', 'draw', 'lose', 'pts'];
      keys.forEach(key => result[key] += input[key]);
      result.avgPts = Number((result.pts / result.matches).toFixed(2));
    }

    const players = await Player.findAll();
    const initResult = {}
    for (const { id, name } of players) {
      initResult[id] = {
        name,
        plays: 0,
        matches: 0,
        win: 0,
        draw: 0,
        lose: 0,
        pts: 0,
        avgPts: 0
      };
    }

    await sequelize.transaction(async (t) => {
      const day = await Record.create({
        date,
        type: 'day',
        result: initResult,
        metadata: {}
      },
      { transaction: t });

      let month = await Record.findOne({
        where: {
          date: date.substring(0, 7)
        }
      });
      if (!month) {
        month = await Record.create({
          date: date.substring(0, 7),
          type: 'month',
          result: initResult,
          metadata: {}
        },
        { transaction: t });
      }

      let year = await Record.findOne({
        where: {
          date: date.substring(0, 4)
        }
      });
      if (!year) {
        year = await Record.create({
          date: date.substring(0, 4),
          type: 'year',
          result: initResult,
          metadata: {}
        },
        { transaction: t });
      }

      for (const [id, value] of Object.entries(result)) {
        addValue(day.result[id], value);
        addValue(month.result[id], value);
        addValue(year.result[id], value);
      }

      day.changed('result', true);
      await day.save({ transaction: t });
      month.changed('result', true);
      await month.save({ transaction: t });
      year.changed('result', true);
      await year.save({ transaction: t });
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

// 기록 내용 변경
router.patch('/date/:date/result', async (req, res) => {
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