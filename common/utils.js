'use strict';

const { Player, Record, Team } = require('./models/index');

function addValue(result, input) {
  const { win, draw, lose } = input;

  result.plays++;
  result.matches += win + draw + lose;
  result.win += win;
  result.draw += draw;
  result.lose += lose;
  result.pts += win * 3 + draw;
  result.avg = result.matches ? Number((result.pts / result.matches).toFixed(2)) : result.matches;
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
    players.forEach(player => result[player.id] = initValue());
    updatePlayers.push(...players);
  }

  const dayRecord = await Record.findByPk(date);
  const monthRecord = await Record.findByPk(date.slice(0, 7));
  const yearRecord = await Record.findByPk(date.slice(0, 4));
  dayRecord.result = result;
  for (const matchLog of Object.values(log)) {
    for (const record of Object.values(matchLog)) {
      for (const id of record.playersId) {
        if (!Object.hasOwn(result, id)) {
          result[id] = initValue();
          dayRecord.result[id] = initValue();
        }
        if (isDelete) result[id][record.type]--;
        else result[id][record.type]++;
      }
    }
  }

  for (const id of Object.keys(result)) {
    const player = await Player.findByPk(id);
    addValue(player.record, result[id]);
    updatePlayers.push(player);

    addValue(dayRecord.result[id], result[id]);
    addValue(monthRecord.result[id], result[id]);
    addValue(yearRecord.result[id], result[id]);

    if (isDelete) {
      player.record.plays -= 2;
      dayRecord.result[id].plays -= 2;
      monthRecord.result[id].plays -= 2;
      yearRecord.result[id].plays -= 2;
    }
  }

  await Promise.all(updatePlayers.map(async updatePlayer => {
    updatePlayer.changed('record', true);
    return updatePlayer.save({ transaction });
  }));

  dayRecord.changed('result', true);
  monthRecord.changed('result', true);
  yearRecord.changed('result', true);
  await dayRecord.save({ transaction });
  await monthRecord.save({ transaction });
  await yearRecord.save({ transaction });
}

module.exports = {
	addValue,
	initValue,
  setResult
}