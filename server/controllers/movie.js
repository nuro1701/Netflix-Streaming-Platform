const movieService = require('../services/movie');
const Movie = require('../models/movie');
const Category = require('../models/category');


const createMovie = async (req, res) => {
    try {
      // Destructure movie details from the request body
      const { name, year, director, genre, rating, description, poster, trailer, length, ageRestriction, filename } = req.body;
  
      // Validate that the required fields are provided
      if (!name || !genre || !filename) {
        return res.status(400).json({ message: 'Movie name and genre are required.' }); // 400 Bad Request
      }
  
      // Create a new movie using the service
      const newMovie = await movieService.createMovie(
        name,
        year,
        director,
        genre,
        rating,
        description,
        poster,
        trailer,
        length,
        ageRestriction,
        filename
      );
  
      if (!newMovie) {
        // If the movie creation fails
        return res.status(500).send('Error creating movie.'); // 500 Internal Server Error
      }
  
      // Return a 201 response with the created movie details
      return res.status(201).json({
        message: 'Movie created successfully.',
        movie: newMovie,
      });
    } catch (error) {
      console.error('Error creating movie:', error); // Log the error for debugging
      return res.status(500).send('Internal Server Error.'); // 500 Internal Server Error
    }
  };
  
  const getAllMovies = async (req, res) => {
    try {
      console.log("reached getAllMovies");
      // Retrieve all movies using the service
      const movies = await movieService.getAllMovies();
  
      if (!movies || movies.length === 0) {
        // If no movies are found
        return res.status(404).json({ message: 'No movies found.' }); // 404 Not Found
      }
  
      // Return a 200 response with the list of movies
      return res.status(200).json(movies);
    } catch (error) {
      console.error('Error retrieving movies:', error); // Log the error for debugging
      return res.status(500).send('Internal Server Error.'); // 500 Internal Server Error
    }
  };
  
  const getMovieById = async (req, res) => {
    try {
      // Extract the movie ID from the request parameters
      const { id } = req.params;
  
      // Retrieve the movie by ID using the service
      const movie = await movieService.getMovieById(id);
  
      if (!movie) {
        // If the movie is not found
        return res.status(404).json({ message: 'Movie not found.' }); // 404 Not Found
      }
  
      // Return a 200 response with the movie details
      return res.status(200).json(movie);
    } catch (error) {
      console.error('Error retrieving movie by ID:', error); // Log the error for debugging
      return res.status(500).send('Internal Server Error.'); // 500 Internal Server Error
    }
  };
  


const getMoviesByCategories = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log("getMoviesByCategories: " + userId);
        const allMovies = await movieService.getMoviesByCategories(userId);
        if (!allMovies) {
          return res.status(404).send("There are no available movies");
        }
        return res.status(200).json(allMovies); 
    }
    catch (error) {
        console.error('Error retrieving movies by categories:', error); // Log the error for debugging
        return res.status(500).send('Internal Server Error.'); // 500 Internal Server Error
    }
};

const updateMovie = async (req, res) => {
    try {
        const result = await movieService.updateMovie(req.params.id, req.body);
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).send("Movie not found");
        }
    } catch (error) {
        console.log("Error updating movie: " + error);
        return res.status(500).send("Internal server error");
    }
};

const deleteMovie = async (req, res) => {
    const movie = await movieService.deleteMovie(req.params.id);
    if (!movie) {
        return res.status(404).send("Error deleting movie."); // 500 Internal Server Error   
    }

    return res.status(204).json({
        message: 'Movie deleted'
    });
}

const searchMovies = async (req, res) => {
    try {
        const movies = await movieService.searchMovies(req.params.query);
        if (!movies || movies.length === 0) {
            return res.status(404).send("No movies found");
        }
        return res.status(200).json(movies);
    } catch (error) {
        console.log("Error searching movies: " + error);
        return res.status(500).send("Internal server error");
    }
}

const getRecommendedMovies = async (req, res) => {
    try{
        const id = req.params.id;
        const userId = req.query.userId;
        const recommendedMovies = await movieService.getRecommendedMovies(userId, id);
        if (!recommendedMovies || recommendedMovies.length === 0) {
            return res.status(404).send("No movies found");
        }
        return res.status(200).json(recommendedMovies);
    } catch (error) {
        console.log("Error getting recommended movies: " + error);
        return res.status(500).send("Internal server error");
    }
}

const addMovieToUser = async (req, res) => {
    try{
        const details = await movieService.addMovieToUser(req.body.userId, req.params.id);
        if (!details || details.length === 0) {
            return res.status(404).send("No movies or users found");
        }
        return res.status(200).json(details);
    } catch (error) {
        console.log("Error getting recommended movies: " + error);
        return res.status(500).send("Internal server error");
    }
}
    module.exports = {createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie,
    updateMovie, deleteMovie, searchMovies, getMoviesByCategories,
    getRecommendedMovies, addMovieToUser
};