const express = require('express');
const router = express.Router();
const { sequelize, Team } = require('../../common/models/index');


// 팀 조회
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({
      order: [[ "name", 'ASC' ]]
    });

    res.json(teams);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
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
            image: teams[name].image
          }
        },
        { transaction: t });
        return team.addPlayers(teams[name].members.map(memeber => memeber.id), { transaction: t });
      }));
    })

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post('/name/:name', async (req, res) => {
  try {
    const { image } = req.body;

    await sequelize.transaction(async (t) => {
      await Team.create({
        name: req.params.name,
        record: {
          win: {},
          draw: {},
          lose: {}
        },
        metadata: {
          image
        }
      },
      { transaction: t });
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
    await sequelize.transaction(async (t) => {
      await Team.destroy({
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
    const team = await Team.findByPk(req.params.name);
    await sequelize.transaction(async (t) => {
      await team.destroy();
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

    await sequelize.transaction(async (t) => {
      await Promise.all(Object.keys(teams).map(async name => {
        const team = await Team.findByPk(name);
        await team.setPlayers([], { transaction: t });
        return team.addPlayers(teams[name].members.map(memeber => memeber.id), { transaction: t });
      }));
    })

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.patch('/reset', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const teams = await Team.findAll();
      await Promise.all(teams.map(async team => {
        return team.setPlayers([], { transaction: t });
      }));
    })

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;