const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const router = new express.Router();

// Creating endpoint to create a user
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();

    if (!user) {
      return res.status(404).send({ error: "Unable to create the user" });
    }
    await user.save();
    res.send({ user: user, token: token });
  } catch (error) {
    res.status(500).send(error);
  }
})

// Login endpoint to login as a user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    if (!user) {
      return res.status(404).send({ error: 'Unable to login' });
    }
    res.send({ user: user, token: token });
  } catch (error) {
    res.status(500).send({ error: 'Unable to login' });
  }
})

// Logout endpoint for one user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    })
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
})

// logout endpoint for all users
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
})

// Reading endpoint to read a user
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
})

// Deleting endpoint to delete a user by id
router.delete('/users/me', auth, async (req, res) => {
  try {
    const user = req.user;
    await user.remove();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

// Updating endpoint to update a user by id
router.patch('/users/me', auth, async (req, res) => {
  const originalUser = req.body;
  const updates = Object.keys(originalUser); // Take the object in and key will returns a array of strings where each is a property on that object
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  // Will loop inside all the updates string and if only one update is not allowed, it'll be false (even for 9 true and just 1 false)
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = req.user;
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