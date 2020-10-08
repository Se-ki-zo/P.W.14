const mongoose = require('mongoose');

// npm install url-validation
// https://www.npmjs.com/package/url-validation

const isUrlValid = require('url-validation'); // test

const userSchema = new mongoose.Schema({ // test
  name: {
    type: String,
    ref: 'name',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate(url) {
      return isUrlValid(url); // test
    },
  },
});

module.exports = mongoose.model('user', userSchema);
