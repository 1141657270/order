var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/channel');
var app = express();
var loginRouter = require('./routes/login')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12341234'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channel', newsRouter);
var cryptoJs = require('crypto-js');

app.use('/client/ads2', require('./routes/ads2'));
app.use('/client/category2', require('./routes/category2'));
app.use('/client/ticket2', require('./routes/ticket2'));

app.use('/client/login', require('./client/login'));
app.use('/client', function (req, res, next) {
  console.log(req.headers.token);
  var id = cryptoJs.AES.decrypt(req.headers.token, 'jssnwjsjdmsajssnsn', { iv: '515s5slkslsksskk' }).toString(cryptoJs.enc.Utf8)
  if (id) {
    req.loginId = id
    next()
  } else {
    res.send({
      success: false,
    })

  }
});
app.use('/client/ticket', require('./client/ticket'));
app.use('/client/customer', require('./client/customer'));
app.use('/client/order', require('./client/order'));
app.use('/login', loginRouter);
// app.use(function(req,res,next){
// if (!req.signedCookies.node_auth) {
//   res.send({
//     success:false,
//     message:"请先登录"
//   })
// }else{
//   next()
// }
// });
app.use('/category', require('./routes/category'));
app.use('/customer', require('./routes/customer'));
app.use('/ads', require('./routes/ads'));
app.use('/ticket', require('./routes/ticket'));
app.use('/admin', require('./routes/admin'));
app.use('/admin2', require('./routes/admin2'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
