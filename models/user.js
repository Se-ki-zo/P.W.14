const mongoose = require('mongoose');

// npm install bcryptjs
// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');

// npm install url-validation
// https://www.npmjs.com/package/url-validation

const isUrlValid = require('url-validation');

// npm install validator
// https://www.npmjs.com/package/validator

const validator = require('validator');

const userSchema = new mongoose.Schema({
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
      return isUrlValid(url);
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) { // test
  return this.findOne({
    email,
  }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
