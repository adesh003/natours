const nodemailer= require('nodemailer')
// const { options } = require('../Routes/userRoutes')

const sendEmail = async (options) =>{
  //1 create transpoter
  
  const transpoter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    },
    
    // activate in gmail "less secure app" option
  })
  
  //2 Define email option 
  const mailOption = {
    from: 'adesh kumar <hello@adesh.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3 actually send the email
  
 await transpoter.sendMail(mailOption)
}

module.exports= sendEmail;