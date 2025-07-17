const express= require('express')
const viewController = require('../controllers/viewsController')

const authController = require('../controllers/authController')

const router = express.Router()

// router.use(authController.isLogedIn)

router.get('/', authController.isLogedIn,viewController.getOverview )
router.get('/tour/:slug', authController.isLogedIn,viewController.getTour)
router.get('/login',authController.isLogedIn, viewController.getLoginForm)
router.get('/me',authController.protect, viewController.getAccount)


module.exports = router;