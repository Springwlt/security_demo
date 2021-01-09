const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const app = express();
const domain = require('domain');
const csurf = require('csurf');
const helmet = require('helmet');
const common = require('./utils/common');
const traceMiddleware = require('./utils/trace');
const port = common.config.port || 3000;
console.log('current NODE_ENV is：%s', process.env.NODE_ENV);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }), csurf());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//跨域处理
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Authorization,content-type,Content-Length');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// 使用 domain 来捕获大部分异常
app.use(function (req, res, next) {
  var reqDomain = domain.create();
  reqDomain.on('error', function (err) {
    console.log(err.stack);
    try {
      res.sendStatus(500);
    } catch (e) {
      console.log('error when exit', e.stack);
    }
  })

  reqDomain.run(next);
});

app.use(traceMiddleware());

// uncaughtException 避免程序崩溃
process.on('uncaughtException', function (err) {
  console.log('Uncaught Exception...');
  console.log(err.stack);
});

//路由列表
app.use('/', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});



app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`App listening at port: ` + port);
});

module.exports = app;
