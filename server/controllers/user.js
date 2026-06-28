const userService = require('../services/user');
const movieService = require('../services/movie');

const createUser = async (req, res) => {
    const user = await userService.getUserByMail(req.body.mail);
    if (user) {
        return res.status(400).json({message: 'Username is already taken'});
    }

    if(!req.body.mail || !req.body.firstName || !req.body.lastName || !req.body.password) {
        return res.status(400).json({ message: 'user mail, first name, last name and password are required.' }); // 400 Bad Request
    }

    const newUser = await userService.createUser(req.body.mail, req.body.firstName,
            req.body.lastName, req.body.password, req.body.profilePic
    );
    if (!newUser) {
        return res.status(500).send("Error creating user."); // 500 Internal Server Error   
    }

    // Return 201 status code and the saved user object
    return res.status(201).json({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePic: req.body.profilePic
    });

};

// Get a user by ID
const getUser = async (req, res) => {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found"); // 404 Not Found
    }

    return res.status(200).json(user);
}

const authenticateUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username and password
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(404).json({ error: 'User not found or invalid credentials' });
        }

        // Return the user's ID
        return res.status(200).json({ userId: user._id });
    } catch (error) {
        console.log("Error authenticating user: " + error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a movie to a user's watched movies
const addMovieToUser = async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        // Find the user by ID
        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the movie by ID
        const movie = await movieService.getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the movie to the user's watched movies
        user.watchedMovies.push({ movieId });
        await user.save();
    } catch (error) {
        console.log("Error adding movie to user: " + error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Remove a movie from a user's watched movies
const removeMovieFromUser = async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        // Find the user by ID
        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the movie by ID
        const movie = await movieService.getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove the movie from the user's watched movies
        user.watchedMovies = user.watchedMovies.filter(watchedMovie => watchedMovie.movieId !== movieId);
        await user.save();
    } catch (error) {
        console.log("Error removing movie from user: " + error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createUser, getUser, authenticateUser, addMovieToUser, removeMovieFromUser };