const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//달마다 month 변경
const dailyChart = require('../data/day/player_day_chart_2025.json');
const monthChart = require('../data/month/player_chart_1_2025.json');
const yearChart = require('../data/year/player_chart_2025.json');
const dailyChartPath = './server/data/day/player_day_chart_2025.json';
const monthChartPath = './server/data/month/player_chart_1_2025.json';
const yearChartPath = './server/data/year/player_chart_2025.json';

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
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('로그 파일 읽기 오류:', err);
            return;
        }

        let logArray;
        if (data){
            try {
                logArray = JSON.parse(data);
            } catch (parseError) {
                console.error('JSON 파싱 오류:', parseError);
                return;
            }
        }

        fs.writeFile(logFilePath, JSON.stringify(logArray, null, 2), (err) => {
            if (err) {
                console.error('로그 파일 쓰기 오류:', err);
            } else {
                console.log('로그 파일이 성공적으로 업데이트되었습니다.');
            }
        });
    });

    for (let id = 0; id < dailyChart.players.length; id++) {
        dailyChart.players[id].win = 0;
        dailyChart.players[id].draw = 0;
        dailyChart.players[id].lose = 0;
        dailyChart.players[id].plays = 0;
        dailyChart.players[id].pts = 0;
    }
    updateChartFile();
}

function plusPlays(ids) {
    ids.forEach(id => {
        dailyChart.players[id].plays ++;
        monthChart.players[id].plays ++;
        yearChart.players[id].plays ++;
        dailyChart.players[id].pts += 5;
        monthChart.players[id].pts += 5;
        yearChart.players[id].pts += 5;
        updateChartFile();
    });
}

function minusPlays(id) {
    if (dailyChart.players[id].plays > 0) {
        dailyChart.players[id].plays --;
        monthChart.players[id].plays --;
        yearChart.players[id].plays --;
        dailyChart.players[id].pts -= 5;
        monthChart.players[id].pts -= 5;
        yearChart.players[id].pts -= 5;
        updateChartFile();
    }
}

function plusWin(id) {
    dailyChart.players[id].win ++;
    monthChart.players[id].win ++;
    yearChart.players[id].win ++;
    dailyChart.players[id].pts += 2;
    monthChart.players[id].pts += 2;
    yearChart.players[id].pts += 2;
    updateChartFile();
}

function minusWin(id) {
    if (dailyChart.players[id].win > 0) {
        dailyChart.players[id].win --;
        monthChart.players[id].win --;
        yearChart.players[id].win --;
        dailyChart.players[id].pts -= 2;
        monthChart.players[id].pts -= 2;
        yearChart.players[id].pts -= 2;
        updateChartFile();
    }
}

function plusDraw(id) {
    dailyChart.players[id].draw ++;
    monthChart.players[id].draw ++;
    yearChart.players[id].draw ++;
    dailyChart.players[id].pts ++;
    monthChart.players[id].pts ++;
    yearChart.players[id].pts ++;
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

function plusLose(id) {
    dailyChart.players[id].lose ++;
    monthChart.players[id].lose ++;
    yearChart.players[id].lose ++;
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
router.get("/getMonth/1", (req, res) => {
    if (!monthChart) return res.status(400).send();
    res.status(200).json({ success: true, monthChart })
});
// let otherChart
// router.get("/month/3", (req, res) => {
//     otherChart = MarChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });
// router.get("/month/4", (req, res) => {
//     otherChart = AprChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });
// router.get("/month/5", (req, res) => {
//     otherChart = MayChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });

// router.get("/month/6", (req, res) => {
//     otherChart = JuneChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });

// router.get("/month/7", (req, res) => {
//     otherChart = JulyChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });

// router.get("/month/8", (req, res) => {
//     otherChart = AugChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });

// router.get("/month/9", (req, res) => {
//     otherChart = SepChart
//     if (!otherChart) return res.status(400).send();
//     res.status(200).json({ success: true, otherChart })
// });

// router.get("/month/10", (req, res) => {
//     otherChart = OctChart
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
    let date = new Date();
    const { attendanceList } = req.body;
    const ids = attendanceList.map(member => member.id);

    if (!dailyChart) return res.status(400).send();
    res.status(200).json({ success: true })
    plusPlays(ids);
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