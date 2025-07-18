const express = require('express')
const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

exports.getOverview= catchAsync(async(req,res,next)=>{
// 1) get tour data from collection
   const tours = await Tour.find()

//2)  building template

//3) render the template using tout data from 1

   res.status(200).render('overview',{
    title:'All Tours',
    tours
   })})


exports.getTour=catchAsync(async(req,res,next)=>{
   // 1) get the data , for the requested tour( include review , tour guide , )

const tour = await Tour.findOne({ slug: req.params.slug })
  .populate({
    path: 'guides',
    select: 'name photo role'
  })
  .populate({
    path: 'reviews',
    select: 'review rating user'
  })

  if(!tour){
   return next(new AppError('there us no tour with that name.' , 404))
  }


   res.status(200).render('tour',{
    title:`${tour.name} Tour`,
    tour
   })})

   exports.getLoginForm = (req, res)=>{
      res.status(200).render('login', {
         title:'Log into your account'
      })

   }

   exports.getAccount= (req,res) => {
         res.status(200).render('account', {
         title:'Your account',
          user: req.user
      })
   }

  exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

