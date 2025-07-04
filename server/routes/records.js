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
router.get('/:date', async (req, res) => {
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

// 기록 추가
router.post('/', async (req, res) => {
	try {
		const { date, data } = req.body;

		await sequelize.transaction(async (t) => {
			return Record.create({
				date,
				type: "day",
				data,
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
		await sequelize.transaction(async (t) => {
			return Record.destroy({
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
router.delete('/:date', async (req, res) => {
	try {
		await sequelize.transaction(async (t) => {
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
router.patch('/:date/info', async (req, res) => {
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
router.patch('/:date/info', async (req, res) => {
	try {
		const { data } = req.body;

		await sequelize.transaction(async (t) => {
			const record = await Record.findByPk(req.params.date);
			record.data = data;
			await record.save({ transaction: t });
		});

		res.sendStatus(204);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

// 월, 년 기록 생성
router.post('/:type', async (req, res) => {
	try {
		const { date } = req.body;

		const where = {
			date: {
				[Sequelize.Op.like]: `${date}-%`
			}
		}
		if (req.params.type === "year") {
			where[Sequelize.Op.and] = [
				Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('date')), 7)
			]
		}

		const records = await Record.findAll({ where });
		const players = await Player.findAll();
		const data = Object.fromEntries(players.map(({ id }) => 
			[ id, {
					score: 0,
					win: 0,
					draw: 0,
					lose: 0,
					count: 0
				}
			]
		));

		for (const record of records) {
			for (const id of Object.keys(record.data)) {
				if (data[id]) {
					data[id].score += record.data[id].score;
					data[id].win += record.data[id].win;
					data[id].draw += record.data[id].draw;
					data[id].lose += record.data[id].lose;
					data[id].count += record.data[id].count;
				}
			}
		}

		await sequelize.transaction(async (t) => {
			return Record.create({
				date,
				type: req.params.type,
				data,
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

module.exports = router;