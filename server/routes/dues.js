const express = require('express');
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { Sequelize, sequelize, Dues } = require('../../common/models/index');
const upload = multer({ dest: "uploads/" });

// 회비 내역 조회
router.get('/', async (req, res) => {
  try {
    const dues = await Dues.findAll({
      order: [[ "date", 'ASC' ]]
    });

    res.json(dues);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/date/:date', async (req, res) => {
  try {
    const dues = await Dues.findAll({
      where: {
        date: {
          [Sequelize.Op.like]: `${req.params.date}%`
        }
      },
      order: [[ "date", 'ASC' ]]
    });

    res.json(dues);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 회비 내역 추가
router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;

  try {
    const ext = path.extname(file.originalname).toLowerCase();
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const range = XLSX.utils.decode_range(sheet["!ref"]);
    let headerRow = -1;

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        const cell = sheet[cellAddress];
        if (!cell) continue;

        const value = String(cell.v || "").trim();
        if (value === "거래일시") {
          headerRow = r;
          break;
        }
      }
      if (headerRow !== -1) break;
    }

    if (headerRow === -1) {
      throw new Error(null);
    }

    const newRange = {
      s: { r: headerRow, c: range.s.c },
      e: { r: range.e.r, c: range.e.c },
    };
    sheet["!ref"] = XLSX.utils.encode_range(newRange);

    const historys = XLSX.utils.sheet_to_json(sheet, { defval: "" })
      .map(row => {
        const newRow = {};
        for (const key in row) {
          if (!key.startsWith("__EMPTY")) {
            newRow[key.trim()] = row[key];
          }
        }
        return newRow;
      })
      .filter(row =>
        Object.values(row).some(val => String(val).trim() !== "")
      );

    const dues = {};
    historys.forEach((history) => {
      const date = history['거래일시'].slice(0, 7).replace(/\./g, "-");
      if (!dues[date]) {
        dues[date] = { 
          money: { 
            in: 0,
            out: 0
          },
          history: []
        }
      }

      dues[date].history.unshift(history);
      const money = Number(history['거래금액'].replace(/,/g, ""));
      if (money > 0) dues[date].money.in += money;
      else dues[date].money.out -= money;
    });

    for (const date of Object.keys(dues)) {
      dues[date].money.balance = Number(dues[date].history[0]['거래 후 잔액'].replace(/,/g, ""));

      await sequelize.transaction(async (t) => {
        await Dues.destroy({
          where: {
            date
          },
          transaction: t
        });

        await Dues.create({
          date,
          history: dues[date].history,
          money: dues[date].money,
          metadata: {}
        },
        { transaction: t });
      });
    }

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } finally {
    fs.unlinkSync(file.path);
  }
});

module.exports = router;