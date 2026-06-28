const UserSchema = require('../models/user');
const jwt = require('jsonwebtoken');

const createUser = async (mail, firstName, lastName, password, profilePic) => {
    try {
       
        if(!mail || !firstName || !lastName || !password) {
            return 'Missing required fields'; // Ensure the required fields are present
        }

        const userSchema = new UserSchema({
            mail: mail,
            firstName: firstName,
            lastName: lastName,
            password: password,
            profilePic: profilePic

        });
        console.log(userSchema);
        await userSchema.save();
        return 'success';
    } catch (error) {
        console.log("Error creating user: " + error);
        return null;
    }
};

const getUserByMail = async (mail) => {
    try {
        const user = await UserSchema.findOne({mail});
        return user;
    } catch (error) {
        console.log("Error getting user: " + error);
        return null;
    }
}

const findUserById = async (id) => {
    try {
        const user = await UserSchema.findById(id);
        return user;
    } catch (error) {
        console.log("Error finding user by ID: " + error);
        return null;
    }
};

const addWatchedMovie = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.user._id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        user.watchedMovies.push({ movieId: req.body.movieId });
        await user.save();

        return res.status(200).send("Movie added to watched list");
    } catch (error) {
        console.log("Error adding watched movie: " + error);
        return res.status(500).send("Internal server error");
    }
};

const authenticateUser = async (req, res) => {
    try {
        const { mail, password } = req.body;

        // Find the user by mail and password
        const user = await UserSchema.findOne({ mail, password });
        if (!user) {
            return res.status(404).json({ error: 'User not found or invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        user.tokens = user.tokens.concat({ token });
        await user.save();

        // Return the token and user's ID
        return res.status(200).json({ userId: user._id, token });
    } catch (error) {
        console.log("Error authenticating user: " + error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {createUser, getUserByMail, findUserById, addWatchedMovie,
    authenticateUser
};