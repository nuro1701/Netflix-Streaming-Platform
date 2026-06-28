// Creating a schematic structure for each film according to guidelines
const mongoose = require('mongoose');
const Counter = require('./counter');

const Schema = mongoose.Schema;

// Define the schema for the "Movie" collection
const MovieSchema = new Schema({
  _id: {
    type: Number 
  },
  name: {
    type: String,
    required: true
  },
  year: {
    // Year the movie was released (defaults to the current year)
    type: Number, 
    default: () => new Date().getFullYear()
  },
  director: {
    // Director of the movie defaults to "Unknown" if not provided
    type: String,
    default: 'Unknown'
  },
  genre: {
    type: String,
    required: true
  },
  rating: {
    // Rating of the movie (defaults to null)
    type: Number, 
    default: null
  },
  description: {
    type: String,
    default: '' 
  },
  poster: {
    // URL of the movie poster
    type: String, 
    default: 'https://cdn.pixabay.com/photo/2022/08/24/20/20/netflix-7408710_1280.png' 
  },
  trailer: {
    // URL of the movie trailer
    type: String, 
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Default trailer link
  },
  length: {
    // Movie's length in minutes
    type: Number,
    default: 0
  },
  ageRestriction : {
    // Movie's age restriction
    type: Number,
    default: 0
  },
  filename: {
    type: String,
    required: true
  }
});

// Middleware: Pre-save hook to handle _id assignment
MovieSchema.pre('save', async function (next) {
  console.log("this.isNew: " + this.isNew);
  if (this.isNew) {
    try {
      // Increment the sequence in the counter collection
      const counter = await Counter.findOneAndUpdate(
        { name: 'movie' },
        { $inc: { seq: 1 } },
        // Create the counter if it doesn't exist
        { new: true, upsert: true } 
      );

      console.log("Counter: " + counter);
      // Assign the incremented sequence to _id
      this._id = counter.seq; 
      console.log("this._id: " + this._id); 
      next();
    } catch (error) {
      // Pass any errors to the next middleware
      next(error); 
    }
  } else {
    next(); 
  }
});

// Export the Movie model for use in other parts of the application
module.exports = mongoose.model('Movie', MovieSchema);