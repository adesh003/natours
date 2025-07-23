// import path from 'node:path';
const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const hpp = require('hpp');



const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const cookieParser= require('cookie-parser')
const reviewRouter= require('./Routes/reviewRoutes')
const bookingRouter= require('./Routes/bookingRoutes')
const viewRouter= require('./Routes/viewRoutes')
const app = express();

app.set('view engine' ,'pug')
app.set('views' ,path.join(__dirname , 'views'))
app.use(express.static(path.join(__dirname,'public')));

// 1)GLOBAL MIDDLEWARES
// SET Security HTTP HEADER


// app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    }
  })
);

// DEVELOPMENT LOGIN
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter= rateLimit({
  max:100,
  windowMs:60 * 60 *1000,
  message:"Too many request from this IP, please try again in an hour!"
})






app.use('/api' , limiter);

// BODY PARSER , READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({limit:'10kb'}));
app.use(cookieParser())

// data sanitization againts NOSQL query injection

// data santization againsts XSS


// prevent parametetr plollution
app.use(hpp({
  whitelist:['duration,']
}))

// serving static file
// app.use(express.static(`${__dirname}/public`));
 

// test milddleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies)
  next();
});

// 3) ROUTES

app.use('/' , viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter); 
app.use('/api/v1/bookings', bookingRouter); 




app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
