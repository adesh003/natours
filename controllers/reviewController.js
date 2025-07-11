const { query } = require('express');
const Review = require('./../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./../controllers/handlerFactory');
const review = require('./../models/reviewModel');



exports.getAllReviews = factory.getAll(review)


exports.setTourUserIds = (req, res, next)=>{
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
}

exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review);
