const express = require('express');
const router = express.Router();
const { sequelize, Team } = require('../../common/models/index');


// 팀 조회
router.get('/', async (req, res) => {
	try {
		const teams = await Team.findAll();

		res.json(teams);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});
router.get('/:name', async (req, res) => {
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
		const { name, playerId } = req.body;

		await sequelize.transaction(async (t) => {
			Team.create({
				name,
				playerId,
				result: {
					scroe: 0,
					win: 0,
					draw: 0,
					lose: 0
				},
				metadata: {}
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
router.delete('/:name', async (req, res) => {
	try {
		await sequelize.transaction(async (t) => {
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

// 팀원 조회
router.get('/:name/players', async (req, res) => {
	try {
		const team = await Team.findByPk(req.params.name);
		const players = await team.getPlayers();

		res.json(players);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

// 팀원 변경
router.patch('/:name/players', async (req, res) => {
	try {
		const { add = [], remove = [] } = req.body;

		await sequelize.transaction(async (t) => {
			const team = await Team.findByPk(req.params.name);
			await team.addPlayers(add, { transaction: t });
			await team.removePlayer(remove, { transaction: t });
		});

		res.sendStatus(204);
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
router.patch('/:name/players/reset', async (req, res) => {
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
router.patch('/:name/record', async (req, res) => {
	try {
		const { win = 0, draw = 0, lose = 0 } = req.body;

		await sequelize.transaction(async (t) => {
			const team = await Team.findByPk(req.params.name);
			team.record.score += win * 3 + draw * 1;
			team.record.win += win;
			team.record.draw += draw;
			team.record.lose += lose;
			team.changed("record", true);
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
					score: 0,
					win: 0,
					draw: 0,
					lose: 0
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
router.patch('/:name/record/reset', async (req, res) => {
	try {
		await sequelize.transaction(async (t) => {
			const team = await Team.findByPk(req.params.name);
			team.record = {
				score: 0,
				win: 0,
				draw: 0,
				lose: 0
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