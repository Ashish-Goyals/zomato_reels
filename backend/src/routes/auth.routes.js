const express = require ('express');
const router = express.Router ();
const userController = require ('../controllers/auth.controller');
const authMiddleware = require ('../middlewares/auth.middleware');

router.post ('/user/register', userController.register);
router.post ('/user/login', userController.login);
router.get ('/user/profile', authMiddleware, userController.getProfile);
router.post ('/user/logout', userController.logout);
router.post ('/food-partner/register', userController.foodPartnerRegister);
router.post ('/food-partner/login', userController.foodPartnerLogin);
router.post ('/food-partner/logout', userController.foodPartnerLogout);
router.get (
  '/food-partner/profile',
  authMiddleware,
  userController.getFoodPartnerProfile
);
module.exports = router;
