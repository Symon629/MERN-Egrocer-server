const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.post('/login', userController.login);
router.post('/register', userController.newUser);

router.get('/get/count', userController.getUserCount);

module.exports = router;
