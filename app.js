var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors  = require('cors')
const  mongoose = require('mongoose');
const config = require('config')
const helmet = require('helmet')
require('dotenv').config()
var indexRouter = require('./routes/index');
var logupRouter = require('./routes/logup');
const apiRouter = require('./routes/api');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile')
const dashboardRouter = require('./routes/dashboard')
const blogRouter = require('./routes/blog')
const houseRouter = require('./routes/house')
// const contactRouter = require('./routes/contact')


// muxit o`zgaruvchisida kalit saqlamagan bolsa dasturni yakunlaydi
if(!config.get('jwtPrivateKey')){
  console.error('NodeJsBeckend_PriveteKey=MySecretKey')
  process.exit(1)
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// CORS sozlamalari
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend domeni
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cookie va headers yuborishni ruxsat berish
    exposedHeaders: ['x-auth-token'], // Tokenni headers orqali ochish
};
app.use(helmet())
app.use(logger('dev'));
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend manzilingiz
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Cookie va headers yuborishni ruxsat berish
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  exposedHeaders: ['x-auth-token'], // Tokenni headers orqali ochish

}));
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connection with mongodb
mongoose.connect('mongodb://localhost/FullStack')
.then(()=>{console.log('MongoDB is connecting')})
.catch((err)=>{console.error(err)}) 

// connection with mongodb at the end

app.use('/', indexRouter);
app.use('/api', logupRouter);
app.use('/api', loginRouter);
app.use('/api',apiRouter)
app.use('/api',profileRouter)
app.use('/api',dashboardRouter)
app.use('/api',blogRouter)
app.use('/api',houseRouter)

// app.use('/api',contactRouter) //email sender doesn't working
// gmailSender filini
// app.use('/emailsender',contactRouter)
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

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
