var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title1: 'Express' });
});
router.get('/home', function (req, res, next) {
  res.render('home', { title: '首页' });
  var db = require("../db");
db.query('select * from ??', ['a'], function (err, result, fields) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
})
});
router.get('/data', function (req, res, next) {
  res.render('data', { title: '输入页' });
});

module.exports = router;
