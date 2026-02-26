const express =require('express')
const app = express()
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const utils = require('./common/utils');
const { sequelize, Player, Record, Team } = require('./common/models/index');

dotenv.config();

process.on('SIGINT', async () => {
  if (sequelize) {
    await sequelize.close();
  }
  process.exit(0);
});

cron.schedule('0 1 0 * * *', async () => {

  const date = new Date();
  const nowYear = String(date.getFullYear());
  const nowMonth = String(date.getMonth() + 1).padStart(2, '0');

  try {
    await sequelize.transaction(async (t) => {
      const players = await Player.findAll();
      const initResult = players.reduce((ret, player) => {
        ret[player.id] = utils.initValue();
        return ret;
      }, {});

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

    await sequelize.transaction(async (t) => {
      date.setDate(date.getDate() - 1);
      const record = await Record.findByPk(`${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
      if (record) {
        if ((Object.keys(record.result).length === 0) && (Object.keys(record.metadata.log).length === 0)) {
          await record.destroy({ transaction: t });
        } else if (Object.keys(record.metadata.teams).length !== 0) {
          await utils.setResult(t, record.date, record.metadata.log);
        }
      }
    });

    await sequelize.transaction(async (t) => {
      const teams = await Team.findAll();
      await Promise.all(teams.map(async team => {
        return team.setPlayers([], { transaction: t });
      }));
    });
  } catch (err) {
    console.log(err);
  }
});

//ajax
app.use(express.json());
app.use(cors());

app.get('/healthcheck', async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log('HealthCheck Success');
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.use(express.static(path.join(__dirname, 'my-app/build')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'my-app/build/index.html'));
})

app.use('/api/players', require('./server/routes/players'));
app.use('/api/records', require('./server/routes/records'));
app.use('/api/teams', require('./server/routes/teams'));
app.use('/api/notifications', require('./server/routes/notifications'));
app.use('/api/suggestions', require('./server/routes/suggestions'));
app.use('/api/dues', require('./server/routes/dues'));
app.use('/api/settings', require('./server/routes/settings'));

//리액트 라우팅
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'my-app/build/index.html'));
})

//build 후 server와 연동할 때
app.listen(process.env.WEB_PORT, function(){
    console.log(`listening on ${process.env.WEB_PORT}`)
})