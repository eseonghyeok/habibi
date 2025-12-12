const express = require('express');
const router = express.Router();
const { sequelize, Notification } = require('../../common/models/index');


// 공지사항 조회
router.get('/', async (req, res) => {
  try {
    const notification = await Notification.findAll({
      order: [[ "index", 'ASC' ]]
    });

    res.json(notification);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 공지사항 추가
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    await sequelize.transaction(async (t) => {
      await Notification.create({
        index: await Notification.count({ transaction: t }) + 1,
        title,
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

// 공지사항 삭제
router.delete('/index/:index', async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      await Notification.destroy({
        where: {
          index: req.params.index
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

// 공지사항 변경
router.patch('/index/:index', async (req, res) => {
  try {
    const { title, content } = req.body;

    const notification = await Notification.findByPk(req.params.index);
    if (!notification) {
      return res.sendStatus(404);
    }

    await sequelize.transaction(async (t) => {
      await notification.update({
        title,
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