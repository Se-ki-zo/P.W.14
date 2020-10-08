const User = require('../models/user.js');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
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
      id: user.id, name: user.name,
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
