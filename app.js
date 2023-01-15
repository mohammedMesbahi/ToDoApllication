var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var session  = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
mongoose.set('strictQuery', false); 
// DB config 
const db = require('./config/keys').MongoURI
var app = express();
// connect to mongo
mongoose.connect(db,{ useNewUrlParser:true})
.then(() => console.log("MongoDb Connecter...."))
.catch(err => console.log(err))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// config passport 
require('./config/passport')(passport);
// sessions
app.use(session({
  secret:'blalehmqsldfhkm', 
  saveUninitialized:false,
  resave:true
}))
// config passport midlleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
 
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
