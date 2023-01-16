var express = require('express');
var router = express.Router();
var {ensurAuthenticated,forwardAuthenticated } = require('../config/auth');
/* GET home page. */
router.get('/',forwardAuthenticated, function(req, res, next) {
  res.render('welcome');
});
// dashboard
router.get('/dashboard',ensurAuthenticated,(req,res)=>{
  res.render("dashboard", { layout: false })
})

module.exports = router;
