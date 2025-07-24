'use strict';

const { Sequelize, sequelize, Player, Record, Team } = require('./models/index');

function addValue(result, input) {
  const { win, draw, lose } = input;

  result.plays ++;
  result.matches += win + draw + lose;
  result.win += win;
  result.draw += draw;
  result.lose += lose;
  result.pts += win * 3 + draw;
  result.avg = Number((result.pts / result.matches).toFixed(2));
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

async function setResult(date, log) {
  const result = {}
  const dayResult = {}
  for (const matchLog of Object.values(log)) {
    for (const record of Object.values(matchLog)) {
      for (const id of record.playersId) {
        if (!Object.hasOwn(result, id)) {
          result[id] = initValue();
          dayResult[id] = initValue();
        }
        result[id][record.type]++;
      }
    }
  }

  const updatePlayers = [];
  const teams = await Team.findAll({
  where: {
    metadata: {
      index: null
    }
  }
  });
  for (const team of teams) {
    const players = await team.getPlayers();
    players.forEach(player => player.record.plays++);
    updatePlayers.push(...players);
  }
  const monthRecord = await Record.findByPk(date.slice(0, 7));
  const yearRecord = await Record.findByPk(date.slice(0, 4));

  for (const id of Object.keys(result)) {
    const player = await Player.findByPk(id);
    addValue(player.record, result[id]);
    updatePlayers.push(player);

    addValue(dayResult[id], result[id]);
    addValue(monthRecord.result[id], result[id]);
    addValue(yearRecord.result[id], result[id]);
  }

  await sequelize.transaction(async (t) => {
    await Promise.all(updatePlayers.map(async updatePlayer => {
      updatePlayer.changed('record', true);
      return updatePlayer.save({ transaction: t });
    }));

    const dayRecord = await Record.findByPk(date);
    dayRecord.result = dayResult;

    dayRecord.changed('result', true);
    monthRecord.changed('result', true);
    yearRecord.changed('result', true);

    await dayRecord.save({ transaction: t });
    await monthRecord.save({ transaction: t });
    await yearRecord.save({ transaction: t });
  });
}

module.exports = {
	addValue,
	initValue,
  setResult
}