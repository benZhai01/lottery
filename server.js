var express = require('express');
var cors = require("cors");
var rn = require('random-number');
var fs = require('fs')

var app = express();

const MAX_COUNT = 270;

app.use(cors());
app.use('/c', express.static("client"));
app.get("/", function(req, res) {
    res.send(generate(req.query.count, req.query.name));
});

app.listen("9090", function(){
    console.log("server is runing on http://127.0.0.1:9090/c/index.html");
    require('child_process').spawn('explorer', ['http://127.0.0.1:9090/c/index.html']);
});


var pool = {};
var cache = {};

const generate = function (count, name) {
    let res = [];
    for (let i = 0; i < count; i++) {
        let new_num = randomNumber();
        if (pool[new_num]) {
            i--;
        } else {
            pool[new_num] = true;
            res.push(format(new_num));
        }
    }
    log(name, res, (error) => {

    });
    return res;
}

const log = function (name, res) {
    var d = new Date();
    var newline = `${d.toLocaleString()} - ${name}: ${res.join(',')} \r\n`;
    cache[name] = newline;
    fs.appendFile('log.txt', newline, (error) => {

    });
}

const format = function (num) {
    var hex = num.toString(16);
    while (hex.length < 3) {
        hex = "0" + hex;
    }
    return hex;
}

const randomNumber = function () {
    return rn({
        max: MAX_COUNT,
        min: 0,
        integer: true
    })
}


