const express = require('express');
const router = express.Router();
const { sequelize, Setting } = require('../../common/models/index');


// 설정 조회
router.get('/name/:name', async (req, res) => {
  try {
    const settings = await Setting.findByPk(req.params.name);

    res.json(settings);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 설정 변경
router.patch('/name/:name', async (req, res) => {
  try {
    const { content } = req.body;

    const settings = await Setting.findByPk(req.params.name);
    await sequelize.transaction(async (t) => {
      await settings.update({
        content
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