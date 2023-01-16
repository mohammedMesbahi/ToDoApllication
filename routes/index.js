var express = require('express');
var router = express.Router();
var Task = require("../models/Task");
var { ensurAuthenticated, forwardAuthenticated } = require('../config/auth');
/* GET home page. */
router.get('/', forwardAuthenticated, function (req, res, next) {
  res.render('welcome');
});
// dashboard
router.get('/dashboard', ensurAuthenticated, async (req, res) => {
  const allTasks = await Task.find({ owner: req.session.passport.user }, { _id: 1, content: 1, date: 1 }).exec();
  res.render("dashboard", { layout: false,allTasks });
})

module.exports = router;
