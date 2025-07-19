const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer')


const multerStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, 'public/img/users');
   
  },
   filename:(req,file,cb)=>{
      // user-id-timeStamp.jpeg
    const ext = file.mimetype.split('/')[1];
    cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)


    }
})

const multerFilter = (req,file ,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }
  else{
    cb(new AppError('Not an image! please upload only image', 404), false)
  }
}

const upload = multer({ 
          
  storage:multerStorage,
  fileFilter:multerFilter
});

exports.uploadUserPhoto =upload.single('photo');





const filterObj = (obj,...allowedFiled) =>{
  const newObj={};
  Object.keys(obj).forEach(el=>{
    if (allowedFiled.includes(el)) newObj[el]= obj[el];
  });
return newObj;
}


  


exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not yet defined ! please use/ signup insted',
  });
};


exports.updateMe =catchAsync(async(req, res, next)=>{
  // 1 ) create error if post passwor data

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'this Route is not for update password. please use /updateMypassword.',
        400
      )
    );
  }
//2 ) Filtered out inwanted fields names that are not allowed

  const filteredBody = filterObj(req.body, 'name', 'email');

  
    if(req.file) filteredBody.photo = req.file.filename;
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
 
})

exports.deleteMe = catchAsync(async(req, res, body) =>
{
  await User.findByIdAndUpdate(req.user.id ,{active:false})
  
  res.status(204) .json({
    status:'success',
    data:null,
  })
})

exports.getMe= (req, res, next) =>{
  req.params.id = req.user.id;
  next();
};

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do not Update password with this route
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

