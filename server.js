// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
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

var log_stat = false;

//Login Test
app.get('/signOut', (req, res) => {
  res.sendFile(__dirname + '/');
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

//Login
app.post('/home/pick_color', function(req, res) {
	var color_hex = req.body.color_hex;
	var color_name = req.body.color_name;
	var color_message = req.body.color_message;
	var insert_statement = "insert into favorite_colors(hex_value, name, color_msg) values($1, $2, $3) on conflict do nothing;";
	var color_select = 'select * from favorite_colors;';
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement, [color_hex, color_name, color_message]),
			task.any(color_select)
		]);
	})
	.then(info => {
		res.render('pages/home',{
			my_title: "Home Page",
			data: info[1],
			color: color_hex,
			color_msg: color_message
		})
	})
	.catch(error => {
		// display error message in case an error
		request.flash('error', err);
		response.render('pages/home',{
			my_title: 'Home Page',
			data: '',
			color: '',
			color_msg: ''
		})
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

function bubbleSort(tmpArr){
  arr = tmpArr;
  console.log(arr);
  //Outer pass
  for(let i = 0; i < arr.length; i++){
      //Inner pass
      for(let j = 0; j < arr.length - i - 1; j++){
          //Value comparison using ascending order
          if(arr[j+1].highscore > arr[j].highscore){
              [arr[j+1],arr[j]] = [arr[j],arr[j+1]]
          }
      }
  };
  console.log(arr);
  return arr;
};

app.get('/leaderboard', function(req, res) {
  sort = bubbleSort(users);
  res.render('pages/leaderboard', {
    my_title: "Leaderboard",
    error: false,
    message: '',
    loggedIn: log_stat,
    username: user.username,
    playerList: sort
  });
});

//------------------------------------
app.listen(3000);
console.log('3000 is the magic port');