const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie'); // Ensure the movieController is correctly imported

router.route('/')
    .post(movieController.createMovie) // Use POST to create a movie
    .get(movieController.getMoviesByCategories); // Use GET to get movies by categories

router.route('/search/:query') // Search query
    .get(movieController.searchMovies);

router.route('/all') 
    .get(movieController.getAllMovies);

router.route('/:id') // Movie ID
    .get(movieController.getMovieById)
    .put(movieController.updateMovie)
    .delete(movieController.deleteMovie);

router.route('/:id/recommend') // Movie ID
    .get(movieController.getRecommendedMovies)
    .post(movieController.addMovieToUser);

module.exports = router;