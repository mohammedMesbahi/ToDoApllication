var express = require('express');
const User = require('../models/User');
var bcrypt = require('bcrypt');
var router = express.Router();
var passport = require("passport");
var { forwardAuthenticated } = require("../config/auth");
/* Login page. */
router.get('/login',forwardAuthenticated, function (req, res, next) {
  res.render('login');
});
// register page
router.get('/register',forwardAuthenticated, function (req, res, next) {
  res.render('register');
});
router.post('/register', (req, res) => {
  // datavalidation 
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!email || !password || !password2 || !name) {
    errors.push({ msg: 'all the fields are required' })
  }
  if (password != password2) {
    errors.push({ msg: 'passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  User.findOne({ email: email }).then(user => {
    if (user) {
      errors = [];
      errors.push({ msg: 'email already registered' });
    }
    if (errors.length) {
      res.render('register', {
        errors,
        email,
        name
      })
    } else {
      const newUser = new User({
        name,
        email
      });
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds)
        .then(function (hash) {
          newUser.password = hash;
          newUser.save()
            .then(user => {
              console.log(res.locals.success_msg)
              req.flash('success_msg', 'you can log in now');

              res.redirect('/users/login');

            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          console.log(err);
        });
    }
  })
})
//login handle 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});
// logout handle
router.get('/logout', function (req, res, next) {

  req.logout(function (err) {
    if (err) { return next(err); }
  })
  req.flash("success_msg","you logged out with success");
  res.redirect('/users/login');
});
module.exports = router;
