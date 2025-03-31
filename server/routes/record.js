const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//오늘의 팀 정보 파일
const dailyTeam = require('../data/day/daily_team_2025.json');
const dailyTeamPath = './server/data/day/daily_team_2025.json';

//달마다 month 변경
const dailyChart = require('../data/day/player_day_chart_2025.json');
const monthChart = require('../data/month/player_chart_4_2025.json');
const yearChart = require('../data/year/player_chart_2025.json');
const dailyChartPath = './server/data/day/player_day_chart_2025.json';
const monthChartPath = './server/data/month/player_chart_4_2025.json';
const yearChartPath = './server/data/year/player_chart_2025.json';

//과거 월간차트
const JanChart = require('../data/month/player_chart_1_2025.json');
const FebChart = require('../data/month/player_chart_2_2025.json');
const MarChart = require('../data/month/player_chart_3_2025.json');

function updateTeamFile() {
    let success = 1;
    fs.writeFile(dailyTeamPath, JSON.stringify(dailyTeam, null, 2), (err) => {
        if (err) {
            console.error('오늘의 팀 정보 JSON 파일 쓰기 오류:', err);
            success = 0;
            return;
        }
    });
    if(success) console.log('오늘의 팀 정보 JSON 파일이 성공적으로 갱신되었습니다.');
}

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

function initDailyTeam() {
    dailyTeam.A = [];
    dailyTeam.B = [];
    dailyTeam.C = [];
    dailyTeam.Others = [];
    dailyTeam.Result.A.win = 0;
    dailyTeam.Result.A.draw = 0;
    dailyTeam.Result.A.lose = 0;
    dailyTeam.Result.B.win = 0;
    dailyTeam.Result.B.draw = 0;
    dailyTeam.Result.B.lose = 0;
    dailyTeam.Result.C.win = 0;
    dailyTeam.Result.C.draw = 0;
    dailyTeam.Result.C.lose = 0;
    updateTeamFile();
}

function editTeam(a, b, c, other) {
    dailyTeam.A = a;
    dailyTeam.B = b;
    dailyTeam.C = c;
    dailyTeam.Others = other;
    updateTeamFile();
}

function plusWinTeam(team) {
    dailyTeam.Result[team].win ++;
    updateTeamFile();
}

function plusDrawTeam(team) {
    dailyTeam.Result[team].draw ++;
    updateTeamFile();
}

function plusLoseTeam(team) {
    dailyTeam.Result[team].lose ++;
    updateTeamFile();
}

function initDailyChart() {
    for (let id = 0; id < dailyChart.players.length; id++) {
        dailyChart.players[id].win = 0;
        dailyChart.players[id].draw = 0;
        dailyChart.players[id].lose = 0;
        dailyChart.players[id].plays = 0;
        dailyChart.players[id].pts = 0;
        dailyChart.players[id].attendance = 0;
    }
    updateChartFile();
}

function plusPlaysByAttend(ids) {
    ids.forEach(id => {
        monthChart.players[id].plays ++;
        yearChart.players[id].plays ++;
        updateChartFile();
    });
}

function checkAttendance(ids) {
    ids.forEach(id => {
        dailyChart.players[id].attendance = 1;
        updateChartFile();
    });
}

function plusPlays(ids) {
    ids.forEach(id => {
        dailyChart.players[id].plays ++;
        monthChart.players[id].plays ++;
        yearChart.players[id].plays ++;
        updateChartFile();
    });
}

function minusPlays(id) {
    if (dailyChart.players[id].plays > 0) {
        dailyChart.players[id].plays --;
        monthChart.players[id].plays --;
        yearChart.players[id].plays --;
        updateChartFile();
    }
}

function plusWin(ids) {
    ids.forEach(id => {
        dailyChart.players[id].win ++;
        monthChart.players[id].win ++;
        yearChart.players[id].win ++;
        dailyChart.players[id].pts += 3;
        monthChart.players[id].pts += 3;
        yearChart.players[id].pts += 3;
    });
    updateChartFile();
}

function minusWin(id) {
    if (dailyChart.players[id].win > 0) {
        dailyChart.players[id].win --;
        monthChart.players[id].win --;
        yearChart.players[id].win --;
        dailyChart.players[id].pts -= 3;
        monthChart.players[id].pts -= 3;
        yearChart.players[id].pts -= 3;
        updateChartFile();
    }
}

function plusDraw(ids) {
    ids.forEach(id => {
        dailyChart.players[id].draw ++;
        monthChart.players[id].draw ++;
        yearChart.players[id].draw ++;
        dailyChart.players[id].pts ++;
        monthChart.players[id].pts ++;
        yearChart.players[id].pts ++;
    });
    updateChartFile();
}

function minusDraw(id) {
    if (dailyChart.players[id].draw > 0) {
        dailyChart.players[id].draw --;
        monthChart.players[id].draw --;
        yearChart.players[id].draw --;
        dailyChart.players[id].pts --;
        monthChart.players[id].pts --;
        yearChart.players[id].pts --;
        updateChartFile();
    }
}

function plusLose(ids) {
    ids.forEach(id => {
        dailyChart.players[id].lose ++;
        monthChart.players[id].lose ++;
        yearChart.players[id].lose ++;
    });
    updateChartFile();
}

function minusLose(id) {
    if (dailyChart.players[id].lose > 0) {
        dailyChart.players[id].lose --;
        monthChart.players[id].lose --;
        yearChart.players[id].lose --;
        updateChartFile();
    }
}

// Get daily team
router.get("/getDailyTeam", (req, res) => {
    if (!dailyTeam) return res.status(400).send();
    res.status(200).json({ success: true, dailyTeam })
});
router.post("/winTeam", (req, res) => {
    let { team } = req.body;
    if (!dailyTeam) return res.status(400).send();
    res.status(200).json({ success: true })
    plusWinTeam(team);
});
router.post("/drawTeam", (req, res) => {
    let { team } = req.body;
    if (!dailyTeam) return res.status(400).send();
    res.status(200).json({ success: true })
    plusDrawTeam(team);
});
router.post("/loseTeam", (req, res) => {
    let { team } = req.body;
    if (!dailyTeam) return res.status(400).send();
    res.status(200).json({ success: true })
    plusLoseTeam(team);
});
router.post("/initDailyTeam", (req, res) => {
    if (!dailyTeam) return res.status(400).send();
    res.status(200).json({ success: true })
    initDailyTeam();
});

// replace default daily chart
router.post("/initDaily", (req, res) => {
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    initDailyChart();
});

// Get daily chart
router.get("/getDaily", (req, res) => {
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true, dailyChart })
});

// Get month chart
router.get("/getMonth/4", (req, res) => {
    if (!monthChart) return res.status(400).send();
    res.status(200).json({ success: true, monthChart })
});

let otherChart
router.get("/getMonth/1", (req, res) => {
    otherChart = JanChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});
router.get("/getMonth/2", (req, res) => {
    otherChart = FebChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});
router.get("/getmonth/3", (req, res) => {
    otherChart = MarChart
    if (!otherChart) return res.status(400).send();
    res.status(200).json({ success: true, otherChart })
});
// router.get("/getmonth/3", (req, res) => {
//     otherChart = MarChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });


// Get year chart
router.get("/getYear", (req, res) => {
    if (!yearChart) return res.status(400).send();
    res.status(200).json({ success: true, yearChart })
});

//plays
router.post("/plusPlays", (req, res) => { 
    const { ids } = req.body;
    
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusPlaysByAttend(ids);
});
router.post("/submitTeams", (req, res) => { 
    const { A, B, C, Others } = req.body;
    const ids = [...A, ...B, ...C, ...Others];
    
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    checkAttendance(ids);
    editTeam(A, B, C, Others);
});
router.post("/minusPlays", (req, res) => {
    const { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusPlays(id);
});

// Win
router.post("/plusWin", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusWin(id);
});
router.post("/minusWin", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusWin(id);
});

//Draw
router.post("/plusDraw", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusDraw(id);
});
router.post("/minusDraw", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusDraw(id);
});

//Lose
router.post("/plusLose", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusLose(id);
});
router.post("/minusLose", (req, res) => {
    let { id } = req.body;
    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    minusLose(id);
});

module.exports = router;