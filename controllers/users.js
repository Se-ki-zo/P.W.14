// npm install bcryptjs
// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');

// npm install jsonwebtoken
// https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  if (!req.body.password) {
    res.status(400).send({
      message: 'Переданы некорректные данные',
    });
    return;
  }

  req.body.password = req.body.password.trim();

  if (req.body.password.length >= 8) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => res.send({ // test
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          res.status(409).send({
            message: 'Пользователь с таким Email уже существует',
          });
        } else {
          res.status(400).send({
            message: 'Переданы некорректные данные',
          });
        }
      });
  } else {
    res.status(400).send({
      message: 'Переданы некорректные данные',
    });
  }
};

module.exports.returnUsers = (req, res) => {
  User.find(req.params)
    .then((user) => res.send({
      data: user,
    }))
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка',
    }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id).orFail(new Error('NotValidId'))
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({
          message: 'Нет ресурсов по заданному Id',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

module.exports.login = (req, res) => { // test
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        }).send({
          token,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({
          message: err.message,
        });
    });
};
