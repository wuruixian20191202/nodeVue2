var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let multer  = require('multer');
let fs=require('fs')
let cookieSession=require('cookie-session')
var history = require('connect-history-api-fallback');

var app = express();

app.all('*', function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");//跨域解决
  // res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Cache-Control", "no-store");//304
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

// 安装中间件multer
// 分目录存储
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user')!==-1||req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname,'public','upload','user'))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname,'public','upload','banner'))
    } else{
      cb(null, path.join(__dirname,'public','upload','product'))
    }
  }
})

let upload=multer({storage})
app.use(upload.any());

// cookie-session 中间件
app.use(cookieSession({
	name:'xianxian',
  keys:['aa','bb','cc'],
  maxAge:1000*60*60*24 //保留cookie的时间
}))


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [{
      from: /^\/.*$/,
      to: function (context) {
        return "/";
      }
    }]
})); //关键一步

// 多资源托管
app.use(express.static(path.join(__dirname, 'public','template')));
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));
app.use(express.static(path.join(__dirname, 'public')));//公共资源


// 接口响应

app.all('/api/*',require('./routes/api/params')) //处理api下的公共接口
app.use('/api/goods',require('./routes/api/goods'))
app.use('/api/reg',require('./routes/api/reg'))
app.use('/api/login',require('./routes/api/login'))
app.use('/api/user',require('./routes/api/user')) //自动登录
app.use('/api/logout',require('./routes/api/logout'))

app.use('/admin/banner',require('./routes/admin/banner'))


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

  if(req.url.includes('/api')){
    res.send({err:1,msg:'不存在'})
  }else if(req.url.includes('/admin')){
    res.render('error')
  }else{
    res.sendFile(path.join(__dirname,'public','template','index.html'))
  }
  // 用户端接口不存在 返回{}
  // 管理端接口不存在，返回{}
  // 资源托管没有相应的页面
  res.render('error');
});

module.exports = app;
