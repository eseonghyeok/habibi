const express = require('express');
const router = express.Router();
const fs = require('fs');

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
const dailyChart = require('../data/day/player_day_chart.json');
const monthChart = require('../data/month/player_chart_' + month + '_' + year + '.json');
const yearChart = require('../data/year/player_chart_' + year + '.json');
const defaultDailyChartPath = './server/data/day/player_day_chart_default.json';
const dailyChartPath = './server/data/day/player_day_chart.json';
const monthChartPath = './server/data/month/player_chart_' + month + '_' + year + '.json';
const yearChartPath = './server/data/year/player_chart_' + year + '.json';

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
    // // 디폴트 파일 읽기
    // const defaultContent = fs.readFileSync(defaultDailyChartPath, 'utf8');

    // // 작업 가능한 파일에 디폴트 내용 덮어쓰기
    // fs.writeFileSync(dailyChartPath, defaultContent);
    // //updateChartFile();
    // console.log('기록체크 페이지를 디폴트 값으로 초기화 했습니다.')
    for (let id = 0; id < 38; id++) {
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
router.get("/month", (req, res) => {
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