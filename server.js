const express =require('express')
const app = express()
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const utils = require('./common/utils');
const { sequelize, Player, Record } = require('./common/models/index');

dotenv.config();

process.on('SIGINT', async () => {
  if (sequelize) {
    await sequelize.close();
  }
  process.exit(0);
});

cron.schedule('0 0 0 * * *', async () => {

  const now = new Date();
  const nowYear = String(now.getFullYear());
  const nowMonth = String(now.getMonth() + 1).padStart(2, '0');

  try {
    await sequelize.transaction(async (t) => {
      const players = await Player.findAll();
      const initResult = {}
      for (const { id, name } of players) {
        initResult[id] = {
          name,
          ...utils.initValue()
        };
      }

      const month = await Record.findOne({
        where: {
          date: `${nowYear}-${nowMonth}`
        }
      });
      if (!month) {
        await Record.create({
          date: `${nowYear}-${nowMonth}`,
          type: 'month',
          result: initResult,
          metadata: {}
        },
        { transaction: t });
      }

      const year = await Record.findOne({
        where: {
          date: nowYear
        }
      });
      if (!year) {
        await Record.create({
          date: nowYear,
          type: 'year',
          result: initResult,
          metadata: {}
        },
        { transaction: t });
      }
    });
    console.log("HealthCheck Success");
  } catch (err) {
    console.log(err);
  }
});

//build 후 server와 연동할 때
app.listen(process.env.WEB_PORT, function(){
    console.log(`listening on ${process.env.WEB_PORT}`)
})


//ajax
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, 'my-app/build')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'my-app/build/index.html'));
})

app.use('/api/chart', require('./server/routes/chart'));
app.use('/api/record', require('./server/routes/record'));
app.use('/api/players', require('./server/routes/players'));
app.use('/api/records', require('./server/routes/records'));
app.use('/api/teams', require('./server/routes/teams'));









//리액트 라우팅
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'my-app/build/index.html'));
})