const userController = require('../controllers/user');

const express = require('express');
const router = express.Router();

router.route('/')
    .post(userController.createUser)
    // .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getUser)
    // .delete(userController.isLoggedIn, userController.deleteUser);

router.route(':/userId/:movieId')
    .post(userController.addMovieToUser)
    .delete(userController.removeMovieFromUser);

module.exports = router;