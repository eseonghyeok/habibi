'use strict';

const { Player, Record } = require('./models/index');

function addValue(result, input) {
  const { win, draw, lose } = input;

  result.plays++;
  result.matches += win + draw + lose;
  result.win += win;
  result.draw += draw;
  result.lose += lose;
  result.pts += win * 3 + draw;
  result.avg = result.matches ? Number((result.pts / result.matches).toFixed(2)) : 0;
}

function initValue() {
  return {
    plays: 0,
    matches: 0,
    win: 0,
    draw: 0,
    lose: 0,
    pts: 0,
    avg: 0
  }
}

async function setResult(transaction, date, log, isDelete = false) {
  const result = {}
  const dayRecord = await Record.findByPk(date);
  if (isDelete) {
    Object.keys(dayRecord.result).forEach(id => {
      result[id] = {
        win: -dayRecord.result[id].win,
        draw: -dayRecord.result[id].draw,
        lose: -dayRecord.result[id].lose,
      }
    });
  } else {
    for (const matchLog of Object.values(log)) {
      for (const record of Object.values(matchLog)) {
        for (const id of record.playersId) {
          if (!Object.hasOwn(result, id)) {
            result[id] = initValue();
            dayRecord.result[id] = initValue();
          }
          result[id][record.type]++;
        }
      }
    }
  }

  const monthRecord = await Record.findByPk(date.slice(0, 7));
  const yearRecord = await Record.findByPk(date.slice(0, 4));
  for (const id of Object.keys(result)) {
    const player = await Player.findByPk(id);

    addValue(dayRecord.result[id], result[id]);
    addValue(monthRecord.result[id], result[id]);
    addValue(yearRecord.result[id], result[id]);
    addValue(player.record, result[id]);

    if (isDelete) {
      dayRecord.result[id].plays -= 2;
      monthRecord.result[id].plays -= 2;
      yearRecord.result[id].plays -= 2;
      player.record.plays -= 2;
    }

    player.changed('record', true);
    await player.save({ transaction });
  }

  dayRecord.changed('result', true);
  monthRecord.changed('result', true);
  yearRecord.changed('result', true);

  dayRecord.metadata.teams = {};
  dayRecord.changed('metadata', true);

  await dayRecord.save({ transaction });
  await monthRecord.save({ transaction });
  await yearRecord.save({ transaction });
}

module.exports = {
	initValue,
  setResult
}