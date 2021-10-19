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

// Updating endpoint to update a book by id
router.patch('/books/:id', async (req, res) => {
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
    const book = await Book.findById(_id);
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
router.delete('/books/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findByIdAndDelete(_id);

    if (!book) {
      return res.status(404).send({ error: "Unable to find the book!" });
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router;