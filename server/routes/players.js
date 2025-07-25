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
    const player = await Player.findByPk(req.params.id);

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

    await sequelize.transaction(async (t) => {
      await Player.create({
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
    await sequelize.transaction(async (t) => {
      await Player.destroy({
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

// 선수 이름 변경
router.patch('/id/:id/name', async (req, res) => {
  try {
    const { name = null } = req.body;

    await sequelize.transaction(async (t) => {
      const player = await Player.findByPk(req.params.id);
      player.name = name;
      await player.save({ transaction: t });
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
      await player.save({ transaction: t });
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

// 선수 출석 변경
router.patch('/id/:id/plays', async (req, res) => {
  try {
    const { isPlay, date } = req.body;

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
        await player.save({ transaction: t });
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