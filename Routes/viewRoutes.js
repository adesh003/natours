const express= require('express')
const viewController = require('../controllers/viewsController')

const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')
const router = express.Router()

// router.use(authController.isLogedIn)

router.get('/',
     bookingController.createBookingCheckout,
     authController.isLogedIn,
     viewController.getOverview 
    
    )



router.get('/tour/:slug', authController.isLogedIn,viewController.getTour)
router.get('/login',authController.isLogedIn, viewController.getLoginForm)
router.get('/me',authController.protect, viewController.getAccount)
router.get('/my-tours',authController.protect, viewController.getMyTours)


router.post('/submit-user-data',authController.protect, viewController.updateUserData);

module.exports = router;