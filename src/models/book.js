const mongoose = require('mongoose');

// Using the Schema mongoose method to define my book model
// It'll also allow later to easily use mongoose middleware
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;