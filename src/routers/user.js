const express = require('express');
const User = require('../models/user');
const router = new express.Router();

// Creating endpoint to create a user
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);

    if (!user) {
      return res.status(404).send({ error: "Unable to create the user" });
    }
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

// Reading endpoint to read a user by id
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send({ error: "Unable to find the user" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

// Deleting endpoint to delete a user by id
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return res.status(404).send({ error: 'Unable to delete the user' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

// Updating endpoint to update a user by id
router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;
  const originalUser = req.body;
  const updates = Object.keys(originalUser);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(_id)
    updates.forEach((update) => {
      user[update] = originalUser[update];
    })
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

module.exports = router;