// const User = require('./../models/userModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const factory = require('./../controllers/handlerFactory');
// const multer = require('multer')
// const sharp = require('sharp')

// // const multerStorage = multer.diskStorage({
// //   destination:(req,file,cb)=>{
// //     cb(null, 'public/img/users');
   
// //   },
// //    filename:(req,file,cb)=>{
// //       // user-id-timeStamp.jpeg
// //     const ext = file.mimetype.split('/')[1];
// //     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)


// //     }
// // })

// const multerStorage = multer.memoryStorage()

// const multerFilter = (req,file ,cb)=>{
//   if(file.mimetype.startsWith('image')){
//     cb(null, true)
//   }
//   else{
//     cb(new AppError('Not an image! please upload only image', 404), false)
//   }
// }

// const upload = multer({ 
          
//   storage:multerStorage,
//   fileFilter:multerFilter
// });

// exports.uploadUserPhoto =upload.single('photo');

// exports.resizeUserPhoto =catchAsync(async(req, res, next)=>{
//     if(!req.file) return next();

//   req.file.filename= `user-${req.user.id}-${Date.now()}.jpeg`

//    await sharp(req.file.buffer)
//     .resize(500 , 500 )
//     .toFormat('jpeg')
//     .jpeg({quality:90})
//     .toFile(`public/img/users/${req.file.filename}`)

//     next();
// })



// const filterObj = (obj,...allowedFiled) =>{
//   const newObj={};
//   Object.keys(obj).forEach(el=>{
//     if (allowedFiled.includes(el)) newObj[el]= obj[el];
//   });
// return newObj;
// }


  


// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'this route not yet defined ! please use/ signup insted',
//   });
// };


// exports.updateMe =catchAsync(async(req, res, next)=>{
//   // 1 ) create error if post passwor data

//   if (req.body.password || req.body.confirmPassword) {
//     return next(
//       new AppError(
//         'this Route is not for update password. please use /updateMypassword.',
//         400
//       )
//     );
//   }
// //2 ) Filtered out inwanted fields names that are not allowed

//   const filteredBody = filterObj(req.body, 'name', 'email');


//     if(req.file) filteredBody.photo = req.file.filename;
//   //3) update user document
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser,
//     },
//   });
 
// })

// exports.deleteMe = catchAsync(async(req, res, body) =>
// {
//   await User.findByIdAndUpdate(req.user.id ,{active:false})
  
//   res.status(204) .json({
//     status:'success',
//     data:null,
//   })
// })

// exports.getMe= (req, res, next) =>{
//   req.params.id = req.user.id;
//   next();
// };

// exports.getAllUser = factory.getAll(User);
// exports.getUser = factory.getOne(User);

// // Do not Update password with this route
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);

const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// CONFIGURE MULTER STORAGE TO USE MEMORY INSTEAD OF DISK
const multerStorage = multer.memoryStorage();

// FILTER TO ONLY ALLOW IMAGE UPLOADS
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// MIDDLEWARE FOR UPLOADING A SINGLE PHOTO
exports.uploadUserPhoto = upload.single('photo');

// MIDDLEWARE FOR RESIZING THE USER PHOTO IN MEMORY
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // Define the filename, as it's not set when using memoryStorage
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Process the image from the buffer in memory
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`); // This line will still fail on a read-only system.
                                                      // It should be replaced with an upload to a cloud service.
                                                      // For example: await uploadToS3(processedImageBuffer, req.file.filename);

  next();
});

// This is a placeholder for a function you would write to upload to a service like S3
// async function uploadToS3(buffer, filename) {
//   // ... logic to upload the buffer to your S3 bucket
// }


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmpassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // Add photo to the filtered body if a new one was uploaded
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
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
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
