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

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
      console.log(err); // test
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(500).send({
          message: 'Ошибка сервера',
        });
      }
    });
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
      id: user.id,
      name: user.name,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
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
      res.send({
        token,
      });
    })
    .catch((err) => {
      res
        .status(401)
        .send({
          message: err.message,
        });
    });
};
