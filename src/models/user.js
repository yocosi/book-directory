// Define the User model
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Book = require('./book');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number!');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

// Virtual property : A relationship between 2 entities. Here users and tasks
userSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'owner'
})

// Hide private data to avoid showing those in public (password, etc)
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

// Generate a token for a user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'book-directory-token');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

// Find a user thanks to his credentials (email and password) to allow him to login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
}

/////////////////
// MIDDLEWARES //
////////////////

// Hash the password while someone is signing up
userSchema.pre('save', async function (next) {
  const user = this; // "this" gives access to the individual user who is about to be saved

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

// When a user is deleted, also delete all the books that the user entered in the database
userSchema.pre('remove', async function (next) {
  const user = this;
  await Book.deleteMany({ owner: user._id })
  next();
})



const User = mongoose.model("User", userSchema);

module.exports = User;