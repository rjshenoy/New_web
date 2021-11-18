// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var session = require('express-session');
var psqlSesh = require('connect-pg-simple')(session);
const pg = require('pg');
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');
const $ = require('jquery');
app.use(bodyParser.urlencoded({ extended: false }));
var pgp = require('pg-promise')();

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

var log_stat = true;

//Session info


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
  var query = "SELECT * FROM leaderboard_scores ORDER BY score DESC;";
  db.task('get-scores', task => {
      return task.any(query);
  })
      .then(info => {
          res.render('pages/leaderboard',{
              my_title: "Leaderboard",
              playerList: info,
              loggedIn: log_stat
          })
      })
      .catch(err => {
          res.render('pages/home', {
              my_title: err,
              data: '',
              loggedIn: log_stat
          })
      });
});


//------------------------------------
app.listen(3000);
console.log('3000 is the magic port');