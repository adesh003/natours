const express = require('express')
const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync');


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
  .exec();


   res.status(200).render('tour',{
    title:`${tour.name} Tour`,
    tour
   })})

   exports.getLoginForm = (req, res)=>{
      res.status(200).render('login', {
         title:'Log into your account'
      })

   }


