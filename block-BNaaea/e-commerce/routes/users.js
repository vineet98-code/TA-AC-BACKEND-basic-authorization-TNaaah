var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Product = require('../models/product');

// Get users listings 
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('users');
});

// create user 
router.get('/register', function(req, res, next) {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('register', { error });
});

// Send user
// router.post('/register', (req, res, next) => {
//   User.create(req.body, (err, createUser) => { // user.create going to invoked same hooks internally by mongo
//     if (err) return next(err);
//     res.redirect('/');
//   });
// });

router.post('/register', function(req, res, next) {
  var { email, password } = req.body;

  if(!email || !password){
    req.flash('error', 'Email/Password is Required');
    return res.redirect('/users/login');
  }

  // password is less than 4 chars
  if (req.body.password.length < 5 || req.body.password.length > 20) {
    req.flash('error', 'Password must be between 5 and 20 characters.');
    return res.redirect('/users/register');
  }

});

// login router
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
  // Email validation
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
     if(err) return next(err);

     if(!user){
      req.flash('error', 'This email is not registered');
      //  if user is not there we do not want to reach verify password i.e use return
       return res.redirect('/users/login');
     } 
     //  Email is valid, password check
     // if user is not null and user schema and verify paswword from models
     user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        res.redirect('/users/login');
      }
      // to uniquely identified the user who login creating uniquely session and persist logged in user information
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      req.session.isBlocked = user.isBlocked;

      res.redirect('/articles/new');
    })
  })
});

// logout router
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

router.use(auth.isUserLoggedIn);

// admin router
router.get('/all', auth.isAdmin, (req, res, next) => {
  User.find({}, 'name email isAdmin isBlocked', (err, users) => {
    if (err) return next(err);
    res.render('listUsers', { users });
  });
});

router.get('/:id/block', auth.isAdmin, (req, res, next) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { $set: { isBlocked: true } }, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/all');
  });
});

router.get('/:id/unblock', auth.isAdmin, (req, res, next) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { $set: { isBlocked: false } }, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/all');
  });
});

router.use(auth.isRegularUser);

// cart router
router.get('/:id/cart', (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .populate('cart')
    .exec((err, user) => {
      if (err) return next(err);
      let prices = user.cart.map((item) => item.price);
      let totalPrice = prices.reduce((acc, price) => acc + price, 0);
      res.render('cart', { user, totalPrice });
    });
});

module.exports = router;