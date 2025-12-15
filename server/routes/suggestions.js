const express = require('express');
const router = express.Router();
const { sequelize, Suggestion } = require('../../common/models/index');


// 건의사항 조회 (로그인한 경우만)
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll({
      order: [
        [ "check", 'ASC' ],
        [ "created_at", 'DESC' ]
      ]
    });

    res.json(suggestions);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 건의사항 추가 (로그인 안 한 경우)
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;

    await sequelize.transaction(async (t) => {
      await Suggestion.create({
        content,
        check: false
      },
      { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 건의사항 체크 상태 변경 (로그인한 경우)
router.patch('/id/:id', async (req, res) => {
  try {
    const { check } = req.body;

    const suggestion = await Suggestion.findByPk(req.params.id);
    if (!suggestion) {
      return res.sendStatus(404);
    }

    await sequelize.transaction(async (t) => {
      await suggestion.update({
        check
      },
      { transaction: t });
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 건의사항 삭제 (로그인한 경우)
router.delete('/id/:id', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      await Suggestion.destroy({
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

module.exports = router;

