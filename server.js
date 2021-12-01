// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var session = require('express-session');
var psqlSesh = require('connect-pg-simple')(session);
const pg = require('pg');
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

app.use(session({
	secret: 'five_guys_super_secret1234five',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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

//User Database Interface
app.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
  var name_check = 'SELECT count(*) FROM user_base WHERE username = $1';
  var insert_statement = 'INSERT INTO user_base VALUES ($1,$2,$3);';
	db.task('check-username', task => {
		return task.batch([
      task.any(name_check,[username])
		]);
	})
	.then(check => {
    if(check[0][0]['count'] > 0){throw 'Username already exists!';}
    else{
      db.task('create-user', task => {
        return task.batch([
          task.any(insert_statement,[username,0,password])
        ]);
      })
      .then(info => {
        res.render('pages/home',{
          my_title: "Ice and Fire",
          error: false,
          message: 'Account Created! You can now log in!',
          loggedIn: req.session.loggedin,
          username: req.session.username
        })
      })
    }
  })
	.catch(err => {
		console.log('error', err);
		res.render('pages/home',{
      my_title: "Ice and Fire",
      error: true,
      message: err,
      loggedIn: req.session.loggedin,
      username: req.session.username
		})
	});
});

app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var select_statement = 'SELECT * FROM user_base WHERE username = $1 AND password = $2';
	db.task('login', task => {
    return task.batch([
      task.any(select_statement,[username,password])
		]);
	})
	.then(info => {
    if(info[0][0]){
      req.session.loggedin = true;
      req.session.username = username;
      req.session.score = info[0][0]['score'];
      res.render('pages/home',{
        my_title: "Ice and Fire",
        error: false,
        message: 'Login Successful!',
        loggedIn: req.session.loggedin,
        username: req.session.username
      })
    }
		else{throw 'Incorrect Username or Password!';}
	})
	.catch(err => {
		console.log('error', err);
		res.render('pages/home',{
      my_title: "Ice and Fire",
      error: true,
      message: err,
      loggedIn: req.session.loggedin,
      username: req.session.username
		})
	});
});

app.post('/user/change_password', function(req, res) {
    var ogpassword = req.body.ogpassword;
    var password = req.body.password;
    var password_check = 'SELECT * FROM user_base WHERE username = $1 AND password = $2';
    var change_password = 'UPDATE user_base SET password=$1 WHERE username=$2;';
    db.task('check-password', task => {
      return task.batch([
        task.any(password_check,[req.session.username,ogpassword])
      ]);
    })
    .then(check => {
      db.task('update-password', task => {
        return task.batch([
          task.any(change_password,[password,req.session.username])
        ]);
      })
      .then(info => {
        if(check[0][0]){
          res.render('pages/user',{
            my_title: "Ice and Fire",
            error: false,
            message: 'Password Update Successful!',
            loggedIn: req.session.loggedin,
            username: req.session.username,
            highscore: req.session.score
          });
        }
        else{
          throw 'Incorrect Password!';
        }
      })
      .catch(err => {
        throw err;
      });
    })
    .catch(err => {
      console.log('error', err);
      res.render('pages/user',{
        my_title: "Ice and Fire",
        error: true,
        message: err,
        loggedIn: req.session.loggedin,
        username: req.session.username,
        highscore: req.session.score
      })
    });
  });

app.get('/logout', function (req, res, next)  {
  if (req.session){
    req.session.destroy(function (err) {
      if(err) {
        return next(err);
      }
      else{
        return res.redirect('/');
      }
    });
  }
});

app.get('/delete', function(req, res) {
	var username = req.session.username;
	var select_statement = 'DELETE FROM user_base WHERE username=$1';
	db.task('login', task => {
    return task.batch([
      task.any(select_statement,[username])
		]);
	})
	.then(info => {
    if (req.session){
      req.session.destroy(function (err) {
        if(err) {
          throw err;
        }
        else{
          res.render('pages/home', {
            my_title: 'Fire and Ice',
            error: false,
            message: 'Account Successfully Deleted!',
            loggedIn: false,
            username: '',
            highscore: -1
          });
        }
      });
    }
	})
	.catch(error => {
		console.log('error', error);
    res.render('pages/user', {
      my_title: 'Fire and Ice',
      error: true,
      message: error,
      loggedIn: req.session.loggedin,
      username: req.session.username,
      highscore: req.session.score
    });
	});
});

// Home page
app.get('/', function(req, res) {
  res.render('pages/home', {
    my_title: "Ice and Fire",
    error: false,
    message: '',
    loggedIn: req.session.loggedin,
    username: req.session.username
  });
});

app.get('/user', function(req, res) {
  if(req.session.loggedin){
    res.render('pages/user', {
      my_title: req.session.username,
      error: false,
      message: '',
      loggedIn: req.session.loggedin,
      username: req.session.username,
      highscore: req.session.score
    });
  }
  else{
    res.redirect('/');
  }
});

app.get('/about', function(req, res) {
  res.render('pages/about', {
    my_title: "About Ice and Fire",
    error: false,
    message: '',
    loggedIn: req.session.loggedin,
    username: req.session.username
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
              error: false,
              message: '',
              loggedIn: req.session.loggedin,
              username: req.session.username
          })
      })
      .catch(err => {
          res.render('pages/home', {
              my_title: err,
              error: true,
              message: err,
              loggedIn: req.session.loggedin,
              username: req.session.username
          })
      });
});


//------------------------------------
app.listen(3000);
console.log('3000 is the magic port');