var express = require('express');


var app = express();
app.use(express.static('MaWan'));


app.listen(3002,function () {
    console.log('妈湾港启动~ 3002');
})