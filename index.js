const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const http = require('http');

const httpPort = 80;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

require('dotenv').config();

function saveUserData(data) {
    fs.writeFileSync('./data/data.json', JSON.stringify(data, null, 2), 'utf8');
}

function loadUserData() {
    try {
        const data = fs.readFileSync('./data/data.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/redirect.html');
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/html/main.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/html/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/html/signup.html');
});

const userData = loadUserData();

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (userData[username] === password) {
        res.send('로그인 성공');
    } else {
        res.send('로그인 실패');
    }
});
  
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (userData[username]) {
        res.send('이미 존재하는 아이디입니다.');
    } else {
        userData[username] = password;

        saveUserData(userData);
  
        res.send('회원가입 성공');
    }
});

app.use(function(req, res, next) {
    res.status(404).sendFile(__dirname + '/html/404.html');
});

http.createServer(app).listen(httpPort);

console.log('HTTP listening on port ' + httpPort);

console.log('Server is Running');
console.log('Now server deployment environment is ' + process.env.NODE_ENV);