const tourController = require('./../controllers/tourController')
const express = require('express')
const authController = require("./../controllers/authController")

const reviewRouter = require('./../Routes/reviewRoutes');
const router = require('./../Routes/reviewRoutes');
const tourRouter = express.Router();




tourRouter.use('/:tourId/reviews' , reviewRouter)

tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
  
tourRouter.route('/tour-stats')
.get(tourController.getTourStats )

tourRouter
.route('/monthly-plan/:year')
.get(authController.protect , 
  authController.restrictTo("admin" , "lead-guide" ,"guide"),
  tourController.getMonthlyPlan)

tourRouter
.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getTourWithin)

tourRouter
.route('/distance/:latlng/unit/:unit')
.get(tourController.getDistances)


tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,authController.restrictTo('admin' , 'lead-guide') ,tourController.createTour);

  

  tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect , 
  authController.restrictTo("admin" , "lead-guide"),
  tourController.uploadTourImagtourController.resizeTourImages,
  tourController.updateTour)
  .delete(
  authController.protect , 
  authController.restrictTo("admin" , "lead-guide"),
  tourController.deleteTour);
  

  
  
module.exports = tourRouter;