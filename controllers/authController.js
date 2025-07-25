const crypto = require('crypto');
const { promisify } = require('node:util')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN// ✅ fixed spelling
  });
};

const createSendToken = (user, statusCode , res) =>{
  const token = signToken(user._id);

  
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  
  if(process.env.NODE_ENV === 'production')cookieOption.secure= true;
  
  res.cookie('jwt', token, cookieOption);
  // remove the password from output
  user.password= undefined
  
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
  });

  // Fixed quote and template literal
  const url = `${req.protocol}://${req.get('host')}/me`;

  // Await the async sendWelcome function
  await new Email(newUser, url).sendWelcome();

  // Include a semicolon and spacing fix
  createSendToken(newUser, 201, res);
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2) check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) if everything ok, send token to client

  createSendToken(user, 200, res);

});


exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    
  });
  res.status(200).json({ status: 'success' });
};


exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token

  let token;
  if (
        // ...existing code...
    req.headers.authorization?.startsWith('Bearer')
    // ...existing code...
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if(req.cookies.jwt){
    token=req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Verification token or Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  
  /////////////////////////
  // console.log('TOKEN RECEIVED:', token);


  //3) check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  //4) Check if user change password after the token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});



// only for rendered pages

exports.isLogedIn = async (req, res, next) => {
 try{
   if(req.cookies.jwt){
  const decoded = await promisify(
    jwt.verify)(req.cookies.jwt,
    process.env.JWT_SECRET);

  //3) check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next()
  }
  //4) Check if user change password after the token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next();
  }
  // there is logedin user
  res.locals.user = currentUser;
  return next();
}
}
catch (err){
  return next()
}
next();
};



exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles["admin","lead-guide"].role='user

    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
 
  try {
   const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

   await new Email(user, resetURL).sendPasswordReset();


    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    
    
    // console.log('RESET TOKEN:', resetToken); // raw token
    // console.log(
    //   'HASHED:',
    //   crypto.createHash('sha256').update(resetToken).digest('hex')
    // );

    
    
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // console.log('INCOMING TOKEN HASH:', hashedToken);
  // console.log('USER FOUND:', user); // might be null

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3) update changePasswordat proprty for the user

  
    
  
  createSendToken(user, 200, res);

  //4) log the user in , sent JWT
});


exports.updatePassword=catchAsync(async(req, res, next)=>{
  //1) get user from collection
  
  const user = await User.findById(req.user.id).select('+password');
  //2) check the if psoted current password is correct
  
  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError('Your Current password is wrong', 401));
  }
  //3) if so, update passwordc
  
  user.password = req.body.password
  user.confirmpassword = req.body.confirmpassword;
  await user.save();
   

  
  createSendToken(user, 200, res);

})