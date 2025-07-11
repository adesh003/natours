const mongoose = require('mongoose');
const dotenv = require('dotenv');



process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! SHUTING DOWN');
  console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true, // Bypass SSL issues
  })
  .then(() => 
    
    console.log('MongoDB Connected successful'))
  
 
console.log(process.env);
const port = 5000;
const server= app.listen(port, () => {
  console.log(`APP runing on port ${port}...`);
});

process.on('unhandledRejection' ,err =>{
  console.log(err);
  console.log("UNHANDLED REJECTION! SHUTING DOWN")
  server.close(() =>{
     process.exit(1);
  });
 
})




