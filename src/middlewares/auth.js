//
// Without middleware: new request -> run the matching route handler
//
// With middleware: new request -> do something (a function, here the ones below) -> run the matching route handler
//

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); // Looking for the header the user is suppose to provide
    const decoded = jwt.verify(token, 'book-directory-token'); // Check if the given token is valid and hasn't expired
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }); // Find the associated user

    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
}

module.exports = auth;