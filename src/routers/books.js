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

// Reading endpoint to find all the books
router.get('/books', async (req, res) => {
  try {
    const book = await Book.find({});

    if (!book) {
      return res.status(500).send({ error: "Unable to find books!" });
    }
    res.send(book);
  } catch (error) {
    res.status(500).send();
  }
})

// Reading endpoint to find a book by id
router.get('/books/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findById(_id);

    if (!book) {
      return res.status(500).send();
    }
    res.send(book);
  } catch (error) {
    res.status(400).send({ error: "Unable to find the book!" });
  }
})

module.exports = router;