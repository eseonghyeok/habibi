'use strict';

function addValue(result, input) {
  const { win, draw, lose } = input;

  result.plays ++;
  result.matches += win + draw + lose;
  result.win += win;
  result.draw += draw;
  result.lose += lose;
  result.pts += win * 3 + draw;
  result.avgPts = Number((result.pts / result.matches).toFixed(2));
}

function initValue() {
  return {
    plays: 0,
    matches: 0,
    win: 0,
    draw: 0,
    lose: 0,
    pts: 0,
    avgPts: 0
  }
}

module.exports = {
	addValue,
	initValue
}