const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController');
const router = require('./reviewRoutes');


const userRouter = express.Router();



userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);


//protect all route after this middleWare

userRouter.use(authController.protect)


userRouter.patch('/updateMyPassword', authController.updatePassword)


userRouter
.get('/me',
  // authController.protect,
  userController.getMe,
  userController.getUser
)
userRouter.patch('/updateMe' , userController.updateMe)
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  
  
  

  
module.exports = userRouter;
