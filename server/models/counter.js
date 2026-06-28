// Creating a schematic structure for a repair counter
const mongoose = require('mongoose');

// Define the schema for the "Counter" collection
const CounterSchema = new mongoose.Schema({
  name: {
    // Name of the counter, each counter must have a unique name
    type: String, 
    required: true,
    unique: true
  },
  seq: {
    // The current sequence number - Defaults to 0 if not explicitly set
    type: Number, 
    default: 0 
  }
});

// Export the Counter model for use in other parts of the application
module.exports = mongoose.model('Counter', CounterSchema);

