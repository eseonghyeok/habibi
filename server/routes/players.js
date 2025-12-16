const express = require('express');
const router = express.Router();
const utils = require('../../common/utils');
const { sequelize, Player, Record } = require('../../common/models/index');


// 선수 조회
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll();

    res.json(players);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 추가
router.post('/', async (req, res) => {
  try {
    const { name, metadata } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.create({
        name,
        record: utils.initValue(),
        metadata
      },
      { transaction: t });

      const monthRecord = await Record.findOne({
        where: {
          type: 'month'
        },
        order: [[ "date", 'DESC' ]]
      });
      const yearRecord = await Record.findOne({
        where: {
          type: 'year'
        },
        order: [[ "date", 'DESC' ]]
      });

      monthRecord.result[player.id] = utils.initValue();
      yearRecord.result[player.id] = utils.initValue();

      monthRecord.changed('result', true);
      yearRecord.changed('result', true);

      await monthRecord.save({ transaction: t });
      await yearRecord.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 삭제
router.delete('/id/:id', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      await Player.destroy({
        where: {
          id: req.params.id
        },
        transaction: t
      });

      const monthRecord = await Record.findOne({
        where: {
          type: 'month'
        },
        order: [["date", 'DESC']]
      });
      const yearRecord = await Record.findOne({
        where: {
          type: 'year'
        },
        order: [[ "date", 'DESC' ]]
      });

      delete monthRecord.result[req.params.id];
      delete yearRecord.result[req.params.id];

      monthRecord.changed('result', true);
      yearRecord.changed('result', true);

      await monthRecord.save({ transaction: t });
      await yearRecord.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 변경
router.patch('/id/:id', async (req, res) => {
  try {
    const { name, metadata } = req.body;

    const player = await Player.findByPk(req.params.id);
    await sequelize.transaction(async (t) => {
      await player.update({
        name,
        metadata
      },
      { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;