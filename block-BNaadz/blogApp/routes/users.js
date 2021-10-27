var express = require('express');
var router = express.Router();

var User = require('../models/User');

// Get users listings 
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('users');
});

// create user
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, createUser) => { // user.create going to invoked same hooks internally by mongo
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/register', function(req, res, next) {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('register', { error });
});

router.post('/register', function(req, res, next) {
  var { email, password } = req.body;
  if(!email || !password){
    req.flash('error', 'Email/Password is Required');
    return res.redirect('/users/login');
  }
});


router.get('/login', function(req, res, next) {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('login', { error });
});

router.post('/login', function(req, res, next) {
  var { email, password } = req.body;
  if(!email || !password){
    req.flash('error', 'Email/Password is Required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
     if(err) return next(err);
     if(!user){
      req.flash('error', 'This email is not registered');
      //  if user is not there we do not want to reach verify password i.e use return
       return res.redirect('/users/login');
     } 
     // if user is not null and user schema and verify paswword from models
     user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        res.redirect('/users/login');
      }
      // to uniquely identified the user who login creating uniquely session and persist logged in user information
      req.session.userId = user.id;
      res.redirect('/articles/new');
    })
  })
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})

module.exports = router;