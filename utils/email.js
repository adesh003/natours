const nodemailer= require('nodemailer');
const pug= require('pug')
// const { options } = require('../Routes/userRoutes')
const htmlToText = require('html-to-text')



module.exports = class Email {
  constructor(user,url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Adesh Kumar <${process.env.EMAIL_FROM}>`

  }

  newTransport(){
    if(process.env.NODE_ENV === 'production'){
      // Sendgrid

      return nodemailer.createTransport({
        service: 'SendGrid',
        auth:{
          user:process.env.SANDGRID_USERNAME,
          pass:process.env.SANDGRID_PASSWORD
        }
      })
    }
    return  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    },
    
    // activate in gmail "less secure app" option
  })
  }
  async send(template , subject){









let html;
try {
  html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    firstName: this.firstName,
    url: this.url,
    subject
  });
} catch (err) {
  console.error('💥 Email Template Rendering Failed:', err);
  throw err;
}




    //1 Render HTML on the pug template
    // const html= pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
    //     firstName: this.firstName,
    //     url: this.url,
    //     subject
    // })


    //2) define the email option
    const mailOption = {
    from: this.from,
    to: this.to,
    subject,
    html,
    text: htmlToText.fromString(html),
  };

  // 3) create a transport and email
  ;
   await this.newTransport().sendMail(mailOption)


  }

 async sendWelcome(){
    await this.send('welcome' , 'Welcome to the natours Family!');
  }

  async sendPasswordReset(){
    await this.send(
      'passwordReset' ,
      'Your password reset token (vlaid for only 10 minutes)'
    );
  }
}

