const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./../controllers/handlerFactory');
const { PaymentMethods } = require('stripe/lib/resources');


exports.getCheckoutSession =catchAsync(async (req,res,next)=>{
        //1  get currently booked tour

        const tour = await Tour.findById(req.params.tourId)



        //2 create checkout session
    const imageUrl = `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`;
    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          unit_amount: tour.price * 100, // amount in paise
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [imageUrl] // Put real image URL or leave blank
          }
        },
        quantity: 1 
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    session
  });
})


// exports.createBookingCheckout= catchAsync(async(req, res, next)=>{
//   const {tour,user,price} =req.query;

//   if(!tour && !user && !price ) return next()
//     await Booking.create({tour, user, price})

//   res.redirect(req.originalUrl.spilt('?')[0])
// })

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});


exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBookings = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)