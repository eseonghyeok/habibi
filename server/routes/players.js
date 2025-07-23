const express = require('express');
const router = express.Router();
const utils = require('../../common/utils');
const { sequelize, Player } = require('../../common/models/index');


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
router.get('/id/:id', async (req, res) => {
  try {
    const player = await Player.findOne({
      where: {
        id: req.params.id
      }
    });

    res.json(player);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 추가
router.post('/', async (req, res) => {
  try {
    const { name, info } = req.body;

    await sequelize.transaction((t) => {
      return Player.create({
        name,
        info,
        record: utils.initValue(),
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

// 선수 삭제
router.delete('/', async (req, res) => {
  try {
    await sequelize.transaction((t) => {
      return Player.destroy({
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
router.delete('/id/:id', async (req, res) => {
  try {
    await sequelize.transaction((t) => {
      return Player.destroy({
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

// 선수 이름 변경
router.patch('/id/:id/name', async (req, res) => {
  try {
    const { name = null } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      player.name = name;
      return player.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 소개 변경
router.patch('/id/:id/description', async (req, res) => {
  try {
    const { description = null } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      player.description = description;
      return player.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 프로필 변경
router.patch('/id/:id/info', async (req, res) => {
  try {
    const { info } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      player.info = info;
      await player.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 기록 변경
router.patch('/id/:id/record', async (req, res) => {
  try {
    const { win = 0, draw = 0, lose = 0 } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      utils.addValue(player.record, { win, draw, lose });
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
router.patch('/id/:id/record/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      player.record = utils.initValue();
      await player.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 선수 팀 변경
router.patch('/id/:id/team', async (req, res) => {
  try {
    const { team = null } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      await player.setTeam(team, { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;