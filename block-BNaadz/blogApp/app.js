var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var remarksRouter = require('./routes/remarks');
var auth = require('./middleware/auth');

// var categoryRouter = require('./routes/category');
// var locationRouter = require('./routes/location');
// var dateRouter = require('./routes/date');

mongoose.connect('mongodb://localhost/blogApp',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => console.log(err ? err : "Connected true")
);
  
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware must always be set after cookiesParser has been added as middleware
app.use(session({
  secret: "secretworld", // it should not be post on github
  // A session is only created if it has been modified
  // if it has some addtional user content then only it going to intialized a session
  // The session is not going to save forcefully all the time even though we don't make any modification 
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

// setting up of middleware and always be set up after the session middleware
app.use(flash());

app.use(auth.userInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/remarks', remarksRouter);
app.use('/articles', articlesRouter);
// app.use('/location', locationRouter);
// app.use('/date', dateRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;