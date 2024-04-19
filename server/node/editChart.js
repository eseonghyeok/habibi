
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let monthChart = require('../data/month/player_chart_' + month + '_' + year + '.json');
let yearChart = require('../data/year/player_chart_' + year + '.json');
let dayChart = require('../data/day/player_day_chart.json');

function plusGoal(id) {
    dayChart.players[id].goal ++;
    monthChart.players[id].goal ++;
    yearChart.players[id].goal ++;
    monthChart.players[id].pts ++;
    yearChart.players[id].pts ++;
}

function minusGoal(id) {
    if (dayChart.players[id].goal > 0) {
        dayChart.players[id].goal --;
        monthChart.players[id].goal --;
        yearChart.players[id].goal --;
        monthChart.players[id].pts --;
        yearChart.players[id].pts --;
    } else {
        //error
    }
}

function plusAssist(id) {
    dayChart.players[id].assist ++;
    monthChart.players[id].assist ++;
    yearChart.players[id].assist ++;
    monthChart.players[id].pts ++;
    yearChart.players[id].pts ++;
}

function minusAssist(id) {
    if (dayChart.players[id].assist > 0) {
        dayChart.players[id].assist --;
        monthChart.players[id].assist --;
        yearChart.players[id].assist --;
        monthChart.players[id].pts --;
        yearChart.players[id].pts --;
    } else {
        //error
    }
}