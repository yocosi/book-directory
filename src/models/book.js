const mongoose = require('mongoose');

const Book = mongoose.model('Book', {
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
  }
})

module.exports = Book;