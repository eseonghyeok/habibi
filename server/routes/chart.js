const express = require('express');
const router = express.Router();
const fs = require('fs');

//달마다 month 변경
const dailyChart = require('../data/day/player_day_chart.json');
const monthChart = require('../data/month/player_chart_7_2024.json');
const yearChart = require('../data/year/player_chart_2024.json');
const dailyChartPath = './server/data/day/player_day_chart.json';
const monthChartPath = './server/data/month/player_chart_7_2024.json';
const yearChartPath = './server/data/year/player_chart_2024.json';

//과거 월간차트
const MarChart = require('../data/month/player_chart_3_2024.json');
const AprChart = require('../data/month/player_chart_4_2024.json');
const MayChart = require('../data/month/player_chart_5_2024.json');
const JuneChart = require('../data/month/player_chart_6_2024.json');

function updateChartFile() {
    let success = 1;
    fs.writeFile(dailyChartPath, JSON.stringify(dailyChart, null, 2), (err) => {
        if (err) {
            console.error('일간 차트 JSON 파일 쓰기 오류:', err);
            success = 0;
            return;
        }
    });

    fs.writeFile(monthChartPath, JSON.stringify(monthChart, null, 2), (err) => {
        if (err) {
            console.error('월간 차트 JSON 파일 쓰기 오류:', err);
            success = 0;
            return;
        }
    });

    fs.writeFile(yearChartPath, JSON.stringify(yearChart, null, 2), (err) => {
        if (err) {
            console.error('연간 차트 JSON 파일 쓰기 오류:', err);
            success = 0;
            return;
        }
    });

    if(success) console.log('모든 차트 JSON 파일이 성공적으로 갱신되었습니다.');
}

function initDailyChart() {
    for (let id = 0; id < dailyChart.players.length; id++) {
        dailyChart.players[id].goal = 0;
        dailyChart.players[id].assist = 0;
        dailyChart.players[id].plays = 0;
    }
    updateChartFile();
}

function plusGoal(id) {
    dailyChart.players[id].goal ++;
    monthChart.players[id].goal ++;
    yearChart.players[id].goal ++;
    monthChart.players[id].pts ++;
    yearChart.players[id].pts ++;
    updateChartFile();
}

function plusAssist(id) {
    dailyChart.players[id].assist ++;
    monthChart.players[id].assist ++;
    yearChart.players[id].assist ++;
    monthChart.players[id].pts ++;
    yearChart.players[id].pts ++;
    updateChartFile();
}

function plusPlays(ids) {
    ids.forEach(id => {
        dailyChart.players[id].plays ++;
        monthChart.players[id].plays ++;
        yearChart.players[id].plays ++;
        monthChart.players[id].pts += 5;
        yearChart.players[id].pts += 5;
        updateChartFile();
    });
}

function minusGoal(id) {
    if (dailyChart.players[id].goal > 0) {
        dailyChart.players[id].goal --;
        monthChart.players[id].goal --;
        yearChart.players[id].goal --;
        monthChart.players[id].pts --;
        yearChart.players[id].pts --;
        updateChartFile();
    }
}

function minusAssist(id) {
    if (dailyChart.players[id].assist > 0) {
        dailyChart.players[id].assist --;
        monthChart.players[id].assist --;
        yearChart.players[id].assist --;
        monthChart.players[id].pts --;
        yearChart.players[id].pts --;
        updateChartFile();
    }
}

function minusPlays(id) {
    if (dailyChart.players[id].plays > 0) {
        dailyChart.players[id].plays --;
        monthChart.players[id].plays --;
        yearChart.players[id].plays --;
        monthChart.players[id].pts -= 5;
        yearChart.players[id].pts -= 5;
        updateChartFile();
    }
}

// replace default daily chart
router.post("/initDaily", (req, res) => {
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    initDailyChart();
});

// Get daily chart
router.get("/daily", (req, res) => {
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true, dailyChart })
});

// Get month chart
let otherChart
router.get("/month/3", (req, res) => {
    otherChart = MarChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});
router.get("/month/4", (req, res) => {
    otherChart = AprChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});
router.get("/month/5", (req, res) => {
    otherChart = MayChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});

router.get("/month/6", (req, res) => {
    otherChart = JuneChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});

router.get("/month/7", (req, res) => {
    if (!monthChart) return res.status(400).send();
    res.status(200).json({ success: true, monthChart })
});

// Get year chart
router.get("/year", (req, res) => {
    if (!yearChart) return res.status(400).send();
    res.status(200).json({ success: true, yearChart })
});

// plus goal
router.post("/plusGoal", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusGoal(id);
});

// plus assist
router.post("/plusAssist", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusAssist(id);
});

// plus plays
router.post("/plusPlays", (req, res) => {
    const { attendanceList } = req.body;
    const ids = attendanceList.map(member => member.id);
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusPlays(ids);
});

// minus goal
router.post("/minusGoal", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusGoal(id);
});

// minus assist
router.post("/minusAssist", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusAssist(id);
});

// minus plays
router.post("/minusPlays", (req, res) => {
    const { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusPlays(id);
});

module.exports = router;