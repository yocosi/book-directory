// All the endpoints for book
const express = require('express');
const Book = require('../models/book');
const auth = require('../middlewares/auth');
const router = new express.Router();

// Creating endpoint to create a book item
router.post('/books', auth, async (req, res) => {
  const books = new Book({
    ...req.body,
    owner: req.user._id
  })

  try {
    await books.save();
    res.status(201).send(books);
  } catch (error) {
    res.status(400).send();
  }
})

// Reading endpoint to find all the books
// GET /books?genre=cyberpunk ==> Filtering data with query string example
router.get('/books', auth, async (req, res) => {
  const match = {};

  if (req.query.genre) {
    match.genre = req.query.genre;
  }

  try {
    let book = await Book.find({ owner: req.user._id });
    if (req.query.genre) {
      book = await Book.find({ owner: req.user._id, genre: match.genre })
    }
    res.send(book);
  } catch (error) {
    res.status(500).send();
  }
})

// Reading endpoint to find a book by id
router.get('/books/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findOne({ _id: _id, owner: req.user._id });

    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(500).send({ error: "Unable to find the book!" });
  }
})

// Updating endpoint to update a book by id
router.patch('/books/:id', auth, async (req, res) => {
  const _id = req.params.id;
  const originalBook = req.body;
  const updates = Object.keys(originalBook);
  const allowedUpdates = ['title', 'author', 'publisher', 'year'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const book = await Book.findOne({ _id: _id, owner: req.user._id });
    updates.forEach((update) => {
      book[update] = originalBook[update];
    })

    await book.save();

    if (!book) {
      return res.status(404).send({ error: "Unable to find the book!" });
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
})

// Deleting endpoint to delete a book item by ID
router.delete('/books/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findOneAndDelete({ _id: _id, owner: req.user._id });

    if (!book) {
      return res.status(404).send({ error: "Unable to find the book!" });
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router;