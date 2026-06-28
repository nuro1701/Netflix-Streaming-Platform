const MovieSchema = require('../models/movie');
const CategorySchema = require('../models/category');
const UserSchema = require('../models/user');
const net = require('net');

const address = process.env.DOCKER_ENV === 'true' ? 'cpp_server' : '127.0.0.1';

// Function to create a new movie
const createMovie = async (name, year, director, genre, rating, description,
    poster, trailer, length, ageRestriction, filename ) => {
    try {
        // Check if all required fields are provided
        if (!name || !genre || !filename) {
            return 'Missing required fields'; // Ensure the required fields are present
        }

        // Create and save the new movie
        const movie = new MovieSchema({
            name: name,
            year: year,
            director: director,
            genre: genre,
            rating: rating,
            description: description,
            poster: poster,
            trailer: trailer,
            length: length,
            ageRestriction: ageRestriction,
            filename: filename
        });
        await movie.save();
        return movie;
    } catch (error) {
        console.log("Error creating movie: " + error);
        return null;
    }
}

// Function to get all movies
const getAllMovies = async () => {
    try {
        // Fetch all movies from the database
        const movies = await MovieSchema.find();
        console.log(movies);
        return movies;
    } catch (error) {
        console.log("Error getting movies: " + error);
        return null;
    }
}

// Function to get a movie by its name
const getMovieByName = async (name) => {
    try {
        // Validate movie name
        if (!name) {
            throw new Error('Movie name is required');
        }

        // Fetch the movie by its name
        const movie = await MovieSchema.findOne({ name: name });
        return movie;
    } catch (error) {
        console.log("Error getting movie: " + error);
        return null;
    }
}

// Function to get movies by categories
const getMoviesByCategories = async (userId) => {
    try {
        // Fetch user data
        const user = await UserSchema.findById(userId);
        if (!user) {
            return null; // If user does not exist, return null
        }

        // Fetch all movies and promoted categories
        const allMovies = await MovieSchema.find();
        console.log(allMovies);
        const categories = await CategorySchema.find({ promoted: true });
        const result = {};

        // If there are no promoted categories, return null
        if (categories.length === 0) {
            return null;
        }

        // Organize movies by category
        categories.forEach(category => {
            result[category.name] = allMovies.filter(movie => movie.genre == category.name && 
                !user.watchedMovies.map(watchedMovie => watchedMovie.movieId).includes(movie._id));

            // Limit the number of movies per category to 20
            if (result[category.name].length > 20) {
                result[category.name] = result[category.name].slice(0, 20);
                result[category.name].sort(() => Math.random() - 0.5);
            }
        });

        // Get and sort watched movies
        result['watched'] = allMovies.filter(movie => 
            user.watchedMovies.some(watchedMovie => watchedMovie.movieId == (movie._id)));
        
        // Sort watched movies by watched date
        result['watched'].sort((a, b) => {
    const aWatchedMovie = user.watchedMovies.find(watchedMovie => watchedMovie.movieId == a._id);
    const bWatchedMovie = user.watchedMovies.find(watchedMovie => watchedMovie.movieId == b._id);

    if (!aWatchedMovie || !bWatchedMovie) {
        console.log("Watched movie not found for a or b");
        return 0; // If either movie is not found, consider them equal
    }

    const aDate = aWatchedMovie.watchedAt;
    const bDate = bWatchedMovie.watchedAt;

    return bDate - aDate;
        });

        // Limit watched movies to 20
        if (result['watched'].length > 20) {
            result['watched'] = result['watched'].slice(0, 20);
        }

        result['watched'].sort(() => Math.random() - 0.5);

        return result;
    } catch (error) {
        console.log("Error getting movies by categories: " + error);
        return null;
    }
}

// Function to get a movie by its ID
const getMovieById = async (id) => {
    try {
        if (!id) {
            throw new Error('Movie ID is required'); // Check if ID is provided
        }

        // Fetch movie by ID
        const movie = await MovieSchema.findById(id);
        return movie;
    } catch (error) {
        console.log("Error getting movie: " + error);
        return null;
    }
}

// Function to update movie details
const updateMovie = async (id, updateData) => {
    try {
        if (!id || !updateData) {
            throw new Error('Movie ID and update data are required'); // Check for valid inputs
        }

        // Update movie by ID
        const movie = await MovieSchema.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        if (!movie) {
            throw new Error('Movie not found'); // Handle case where movie is not found
        }
        return movie;
    } catch (error) {
        console.log("Error updating movie: " + error);
        return null;
    }
}

// Function to delete a movie by its ID
const deleteMovie = async (id) => {
    try {
        if (!id) {
            throw new Error('Movie ID is required'); // Ensure ID is provided
        }

        // Delete movie by ID
        const movie = await MovieSchema.findByIdAndDelete(id);
        if (!movie) {
            throw new Error('Movie not found'); // Handle case where movie is not found
        }

        // Delete movie from recommendation system
        // Get all users who watched the movie
        // $elemMatch is used to match an element in an array of objects
        const users = await UserSchema.find({ watchedMovies: { $elemMatch: { movieId: id } } });
        for (let i = 0; i < users.length; i++) {
            // Remove the movie from the user's watchedMovies array
            // $pull is used to remove an element from an array
            await UserSchema.findByIdAndUpdate(users[i]._id, { $pull: { watchedMovies: { movieId: id } } });
            await deleteMovieInRecommendationSys(users[i]._id, id);
        } 
        return 'success';
    } catch (error) {
        console.log("Error deleting movie: " + error);
        return null;
    }
}

const deleteMovieInRecommendationSys = async (userId, movieId) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket(); // Create a new socket

        client.connect(5555, address, () => { // Connect to the server
            client.write(`DELETE ${userId} ${movieId}`); // Send the request
        });

        // Handle incoming data from the server
        client.on('data', (data) => {
            if(data != "") {
                var response = data.toString().split(' ')[0];
            }
            // OK status
            if(response == "200") {
                resolve("success");
            } else {
                resolve("error");
            }
            client.destroy(); // Close the connection after receiving data
        });

        // Handle errors from the socket connection
        client.on('error', (error) => {
            console.log("Error deleting recommended movies: " + error);
            reject(null);
        });

        // Handle connection close
        client.on('close', () => {
            console.log('Connection closed');
        });
    });
}   

// Function to search for movies by name
const searchMovies = async (name) => {
    try {
        console.log("Searching for movies with name: " + name);
        console.log("Type of name: " + typeof name);
        if (!name || typeof name !== 'string') {
            throw new Error('Search term must be a string'); // Validate search term
        }

        // Search for movies with a case-insensitive name match
        const movies = await MovieSchema.find({ name: { $regex: name, $options: 'i' } });
        return movies;
    } catch (error) {
        console.log("Error searching movies: " + error);
        return null;
    }
}

// Function to get recommended movies (e.g., from a recommendation engine)
const getRecommendedMovies = async (userId, movieId) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket(); // Create a new socket

        client.connect(5555, address, () => { // Connect to the server
            client.write(`GET ${userId} ${movieId}`); // Send the request
        });

        // Handle incoming data from the server
        client.on('data', (data) => {
            if(data != "") {
                var response = data.toString().split(' ')[0];
            }
            // OK status
            if(response == "200") {
                // Get the words after the last '\n' character
                var recommendedMovies = data.toString().split('\n').pop();
                resolve(recommendedMovies);
            } else {
                resolve(JSON.parse("[]"));
            }
            client.destroy(); // Close the connection after receiving data
        });

        // Handle errors from the socket connection
        client.on('error', (error) => {
            console.log("Error getting recommended movies: " + error);
            reject(null);
        });

        // Handle connection close
        client.on('close', () => {
            console.log('Connection closed');
        });
    });
}

// Function to add a movie to a user's watched list
const addMovieToUser = async (userId, movieId) => {
    try {
        const user = await UserSchema.findById(userId);
        if (!user) {
            return null; // Handle case where user does not exist
        }

        const movie = await MovieSchema.findById(movieId);
        if (!movie) {
            return null; // Handle case where user does not exist
        }
        const response = await addMovieToUserInReccomendation(userId, movieId);
        // Add the movie to the user's watchedMovies array
        user.watchedMovies.push({ movieId });
        await user.save();

        return { userId: user._id, movieId: movieId };
    } catch (error) {
        console.log("Error adding movie to user: " + error);
        return null;
    }
}

const addMovieToUserInReccomendation = async (userId, movieId) => {
    const user = await UserSchema.findById(userId);
    return new Promise((resolve, reject) => {
        const client = new net.Socket(); // Create a new socket

        client.connect(5555, address, () => { // Connect to the server
            var task = 'POST';
            // If user already watched a movie, send PATCH request
            // user.watchedMovies is an array of objects containing movieId
            console.log(user.watchedMovies.length);
            if(user.watchedMovies.length > 0) {
                task = 'PATCH';
            }
            client.write(`${task} ${userId} ${movieId}`); // Send the request
        });

        // Handle incoming data from the server
        client.on('data', (data) => {
            // Get only first word from the response
            data = data.toString().split(' ')[0];
            resolve(JSON.parse(data));
            client.destroy(); // Close the connection after receiving data
        });

        // Handle errors from the socket connection
        client.on('error', (error) => {
            console.log("Error getting recommended movies: " + error);
            reject(null);
        });

        // Handle connection close
        client.on('close', () => {
            console.log('Connection closed');
        });
    });
}

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    getMovieByName,
    getMoviesByCategories,
    updateMovie,
    deleteMovie,
    searchMovies,
    getRecommendedMovies,
    addMovieToUser
};