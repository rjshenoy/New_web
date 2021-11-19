// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var session = require('express-session');
var psqlSesh = require('connect-pg-simple')(session);
const pg = require('pg');
const cors = require("cors");
const cookieParser = require("cookie-parser");
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');
const $ = require('jquery');
app.use(bodyParser.urlencoded({ extended: false }));
var pgp = require('pg-promise')();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "five_guys_shhhhh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 30,
    },
  })
);

//SQL Setup
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'game_db',
	user: 'postgres',
	password: 'pwd'
};
var db = pgp(dbConfig);

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

//Temporary User Test
let users = [
  {username: 'Mitch',
  password: 'secret',
  highscore: '1234'},
  {username: 'Austin',
  password: 'piano',
  highscore: '0'},
  {username: 'Rahul',
  password: 'rahuligan',
  highscore: '989'},
  {username: 'Kevin',
  password: 'password123',
  highscore: '555'}
];
var user = users[0];

var log_stat = false;

//Session info


//Create Account
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const score = '0';
  db.query("INSERT INTO user_base(username,score,password) VALUES ("+username+","+score+","+password+");")
  .then(r => console.log(r))
  .catch(e => console.log(e))
});

// Home page
app.get('/', function(req, res) {
  res.render('pages/home', {
    my_title: "Game.io",
    error: false,
    message: '',
    loggedIn: log_stat,
    username: user.username
  });
});

app.get("/login", (req, res) => {
  if (req.session.username) {
    res.send({ loggedIn: true, user: req.session.username });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user_base WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        password.localeCompare( result[0].password, (err, res) => {
          if (res) {
            req.session.username = result;
            console.log(req.session.username);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});
app.get('/user', function(req, res) {
  if(log_stat){
    res.render('pages/user', {
      my_title: "User Page",
      error: false,
      message: '',
      loggedIn: log_stat,
      username: user.username,
      highscore: user.highscore
    });
  }
  else{
    res.render('pages/home', {
      my_title: "Game.io",
      error: true,
      message: 'Not logged in',
      loggedIn: log_stat,
      username: user.username
    });
  }
});

app.get('/about', function(req, res) {
  res.render('pages/about', {
    my_title: "About Game.io",
    error: false,
    message: '',
    loggedIn: log_stat,
    username: user.username
  });
});

//Leaderboard
app.get('/leaderboard', function(req, res) {
  var query = "SELECT * FROM user_base ORDER BY score DESC;";
  db.task('get-scores', task => {
      return task.any(query);
  })
      .then(info => {
          res.render('pages/leaderboard',{
              my_title: "Leaderboard",
              playerList: info,
              loggedIn: log_stat,
              username: user.username
          })
      })
      .catch(err => {
          res.render('pages/home', {
              my_title: err,
              data: '',
              loggedIn: log_stat,
              username: user.username
          })
      });
});


//------------------------------------
app.listen(3000);
console.log('3000 is the magic port');