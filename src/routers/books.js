const express = require('express');
const Book = require('../models/book');
const router = new express.Router();

// Creating endpoint to create a book item
router.post('/books', async (req, res) => {
  const books = new Book(req.body);

  try {
    await books.save();
    res.status(201).send(books);
  } catch (error) {
    res.status(400).send();
  }
})

module.exports = router;