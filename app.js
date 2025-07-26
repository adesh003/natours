// import path from 'node:path';
const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const hpp = require('hpp');
const compression = require('compression')


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



app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "'unsafe-inline'", // only if necessary
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "'unsafe-inline'", // needed for many CSS-in-JS libs
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
      mediaSrc: ["'self'", "https://ssl.gstatic.com"],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://127.0.0.1:5000", // your API
      ],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"], // good security
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  })
);
// ---------------------

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
 
app.use(compression());


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
