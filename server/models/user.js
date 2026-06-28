const mongoose = require('mongoose');
const Counter = require('./counter');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

// Define the schema for the "User" collection
const UserSchema = new Schema({
  _id: {
    // Unique identifier for each user (assigned via counter)
    type: Number 
  },
  mail: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true 
  },
  profilePic: {
    // URL of the user's profile picture
    type: String, 
    default: 'https://www.gravatar.com/avatar/;d=mp' // Default Gravatar URL
  },
  watchedMovies: [
    {
      movieId: {
        // Reference to a movie by its ID. Specifies the "Movie" model for population
        type: Number, 
        ref: 'Movie'
      },
      watchedAt: {
        // Date when the movie was watched. Defaults to the current date
        type: Date, 
        default: Date.now
      }
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Pre-save hook to handle _id assignment
UserSchema.pre('save', async function (next) { 
    console.log("this.isNew: " + this.isNew);
    if (this.isNew) {
      try {
        // Increment the sequence in the counter collection
        const counter = await Counter.findOneAndUpdate(
          { name: 'user' }, // Identifier for the counter
          { $inc: { seq: 1 } }, // Increment sequence
          { new: true, upsert: true } // Create counter if it doesn't exist
        );
        console.log("Counter: " + counter);
        this._id = counter.seq; // Assign the incremented sequence to _id
        console.log("this._id: " + this._id);
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();   
    }
  });

module.exports = mongoose.model('User', UserSchema);