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
    const { name, info, description } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.create({
        name,
        info,
        record: utils.initValue(),
        description,
        metadata: {}
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
    const { name, info, description } = req.body;

    const player = await Player.findByPk(req.params.id);
    await sequelize.transaction(async (t) => {
      await player.update({
        name,
        info,
        record: utils.initValue(),
        description,
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

// 선수 출석 변경
router.patch('/id/:id/plays', async (req, res) => {
  try {
    const { isPlay } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      player.record.plays += isPlay ? 1 : -1;
      player.changed('record', true);
      await player.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 기록 초기화
router.patch('/record/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const players = await Player.findAll();
      await Promise.all(players.map(async (player) => {
        player.record = utils.initValue();
        return player.save({ transaction: t });
      }));
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;