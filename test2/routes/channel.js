var express = require('express');
var router = express.Router();

  router.get('/news', function(req, res, next) {
    res.render('home', { title: 'news' });
  });
  router.get('/sport', function(req, res, next) {
    res.render('home', { title: 'sport'});
  });
  router.get('/music', function(req, res, next) {
    res.render('home', { title: 'music'});
  });
  module.exports=router;