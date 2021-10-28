var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

// only if the userId is available in the session then only you can visit the protected resources, 
// if the you are not login you will be redirected to login page 
router.get('/protected', auth.loggedInUser, (req, res, next) => {
    res.send("Protected Resources");
});

module.exports = router;