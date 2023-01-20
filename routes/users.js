var express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
var bcrypt = require('bcrypt');
var router = express.Router();
var passport = require("passport");
var { ensurAuthenticated, forwardAuthenticated } = require('../config/auth');
/* Login page. */
router.get('/login', forwardAuthenticated, function (req, res, next) {
  res.render('login');
});
// register page
router.get('/register', forwardAuthenticated, function (req, res, next) {
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
    if (err) { 
      return next(err); 
    }
  })
  req.flash("success_msg", "you logged out with success");
  res.redirect('/users/login');
});
// create task handler
router.post('/createTask', ensurAuthenticated, (req, res) => {
  const { task } = req.body;
  if (task != '') {
    var newTask = new Task({
      owner: req.session.passport.user,
      content: task
    });
    console.log(newTask);
    newTask.save()
      .then(result => {
        req.flash("success_msg", "added with success")
        res.redirect("/dashboard");
      })
      .catch(err => {
        console.log(err);
        res.status(501).send();
      })

  } else {
    req.flash("error_msg","please fill out the task field");
    res.redirect('/dashboard');
  }

})
router.get("/allTasks", ensurAuthenticated, async (req, res) => {
  const allTasks = await Task.find({ owner: req.session.passport.user }, { _id: 1, content: 1, date: 1 }).exec();
  res.render('dashboard', { allTasks });
});
router.post("/deleteTask", ensurAuthenticated, async (req, res) => {
  console.log(req);
  const { taskId } = req.body;
  if(taskId)
  if (taskId.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findByIdAndDelete` call.
    Task.findByIdAndDelete(taskId).exec()
      .then(result => {
        res.send();
      })
      .catch(err => {
        console.log(err);
        res.status(502).send();
      })
  } else {
    res.status(401).send();
  }
})
module.exports = router;
