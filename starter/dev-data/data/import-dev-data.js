import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../../../models/tourModel.js';
import review from '../../../models/reviewModel.js';
import User from '../../../models/userModel.js'
import Review from '../../../models/reviewModel.js';


// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true, // Bypass SSL issues
  })
  .then(() => console.log('MongoDB Connected successfully'))
  .catch((err) => console.error('DB Connection Error:', err));

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));



// Import data into DB
const importData = async () => {
  try {
    
    await Tour.create(tours)
    await User.create(users,{ validateBeforeSave:false})

    await Review.create(reviews)
    console.log('Data successfully loaded');
  } catch (err) {
    console.error('Error importing data:', err);
  }
  process.exit();
};

// Delete all data from the collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    // This deletes all documents, no need to pass an array
    console.log('Data successfully deleted');
  } catch (err) {
    console.error('Error deleting data:', err);
  }
  process.exit();
};


 console.log(process.argv)
 
// Handle CLI arguments


if (process.argv.includes('--import')) {
  importData();
} else if (process.argv.includes('--delete')) {
  deleteData();
}

console.log('Command-line arguments:', process.argv);
