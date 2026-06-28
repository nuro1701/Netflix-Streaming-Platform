// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose'); 

// Extract the Schema constructor for defining database schemas
const Schema = mongoose.Schema; 

// Define the schema for the "Category" collection
const CategorySchema = new Schema({
    _id: {
        // Unique identifier for each document
        type: Schema.Types.ObjectId,
        default: null
    },
    name: {
        // Name of the category 
        type: String, 
        required: true 
    },
    movies: {
        // List of movies associated with the category, defaults to an empty array
        type: Array, 
        default: [] 
    },
    promoted: {
        // Indicates whether the category is promoted. Defaults to false
        type: Boolean,
        default: false
    }
});

// Export the Category model for use in other parts of the application
module.exports = mongoose.model('Category', CategorySchema);

