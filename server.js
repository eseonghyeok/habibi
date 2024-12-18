const express =require('express')
const app = express()
const path = require('path')
const cors = require('cors');

//build 후 server와 연동할 때
app.listen(8080, function(){
    console.log('listening on 8080')
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









//리액트 라우팅
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'my-app/build/index.html'));
})