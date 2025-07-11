const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
// const validator = require('validator');
// name , email , photo, password, password confirm

const userSchemas = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name required'],
  },
  email: {
    type: String,
    require: [true, 'Email required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role:{
      type:String,
      enum: ["user" ,"guide" , "lead-guide","admin"],
      default: 'user'
    },
  password: { 
    type: String,
    require: [true, 'Password Required'],
    minLength: [8, 'Pasword must be 8 charcter'],
    select: false,
  },
  confirmpassword: {
    type: String,
    require: [true, 'Password Required'],
    minLength: [8, 'Pasword must be 8 charcter'],
    validate: {
      //  this only work on CREATE AND SAVE!!
      validator: function (el) {
        return el === this.password; // abc===abc
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken:String,
  passwordResetExpires:Date,
  active:{
    type:Boolean,
    default:true,
    select:false,
  }
});

userSchemas.pre('save', async function (next) {
  // only run if password modified

  if (!this.isModified('password')) return next();

  // hash the password with 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete confirm password field
  this.confirmpassword = undefined;
  next();
});


userSchemas.pre(/^find/, function(next) {
  // this points to current query
  
  this.find({active:{$ne:false}});
  next();
})
userSchemas.pre('save' , function(next){
  if(!this.isModified('password')|| this.isNew) return next();
  
  this.passwordChangedAt = Date.now() -1000
  next();
})

userSchemas.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchemas.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


  userSchemas.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

const User = mongoose.model('User', userSchemas);

module.exports = User;