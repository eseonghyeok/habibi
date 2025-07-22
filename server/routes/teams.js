const express = require('express');
const router = express.Router();
const utils = require('../../common/utils');
const { Sequelize, sequelize, Team } = require('../../common/models/index');


// 팀 조회
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({
      order: [
        [Sequelize.json('metadata.index'), 'ASC']
      ]
    });

    res.json(teams);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get('/name/:name', async (req, res) => {
  try {
    const team = await Team.findOne({
      where: {
        name: req.params.name
      }
    });

    res.json(team);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 팀 추가
router.post('/', async (req, res) => {
  try {
    const { teams } = req.body;

    await sequelize.transaction(async (t) => {
      await Promise.all(Object.keys(teams).map(async name => {
        const team = await Team.create({
          name,
          record: {
            win: {},
            draw: {},
            lose: {}
          },
          metadata: {
            index: teams[name].index
          }
        },
        { transaction: t });
        await team.addPlayers(teams[name].members.map(memeber => memeber.id), { transaction: t });
      }));
    })

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 팀 삭제
router.delete('/', async (req, res) => {
  try {
    await sequelize.transaction((t) => {
      return Team.destroy({
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
router.delete('/name/:name', async (req, res) => {
  try {
    await sequelize.transaction((t) => {
      return Team.destroy({
        where: {
          name: req.params.name
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

// 팀 변경
router.patch('/', async (req, res) => {
  try {
    const { teams } = req.body;

    await sequelize.transaction((t) => {
      return Promise.all(Object.keys(teams).map(async name => {
        const team = await Team.findByPk(name);
        await team.setPlayers([], { transaction: t });
        await team.addPlayers(teams[name].members.map(memeber => memeber.id), { transaction: t });
      }));
    })

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 팀원 조회
router.get('/name/:name/players', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.name);
    const players = team ? await team.getPlayers() : [];

    res.json(players);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 팀원 초기화
router.patch('/players/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const teams = await Team.findAll();
      for (const team of teams) {
        await team.setPlayers([], { transaction: t });
      }
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.patch('/name/:name/players/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const team = await Team.findByPk(req.params.name);
      await team.setPlayers([], { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 팀 기록 변경
router.patch('/record', async (req, res) => {
  try {
    const { match, firstTeam, secondTeam } = req.body;

    await sequelize.transaction(async (t) => {
      let team = await Team.findByPk(firstTeam.name);
      let players = await team.getPlayers(firstTeam.name);
      team.record[firstTeam.type][match] = players.map(player => player.id);
      team.changed('record', true);
      await team.save({ transaction: t });
      team = await Team.findByPk(secondTeam.name);
      players = await team.getPlayers(secondTeam.name);
      team.record[secondTeam.type][match] = players.map(player => player.id);
      team.changed('record', true);
      await team.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.patch('/name/:name/record', async (req, res) => {
  try {
    const { win = {}, draw = {}, lose = {} } = req.body;

    await sequelize.transaction(async (t) => {
      const team = await Team.findByPk(req.params.name);
      team.record.win = win;
      team.record.draw = draw;
      team.record.lose = lose;
      team.changed('record', true);
      await team.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 팀 기록 초기화
router.patch('/record/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const teams = await Team.findAll();
      await Promise.all(teams.map(async (team) => {
        team.record = {
          win: {},
          draw: {},
          lose: {}
        }
        return team.save({ transaction: t });
      }));
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.patch('/name/:name/record/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const team = await Team.findByPk(req.params.name);
      team.record = {
        win: {},
        draw: {},
        lose: {}
      }
      await team.save({ transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;