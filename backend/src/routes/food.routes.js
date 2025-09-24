const express = require ('express');
const router = express.Router ();
const authMiddleware = require ('../middlewares/auth.middleware');
const foodController = require ('../controllers/food.controller');
const multer = require ('multer');
const uploads = multer ({storage: multer.memoryStorage ()});

router.post (
  '/',
  authMiddleware,
  uploads.single ('video'),
  foodController.createFoodItem
);
router.get ('/', authMiddleware, foodController.getAllFoodItems);

module.exports = router;
