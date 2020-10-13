const Card = require('../models/card.js');

module.exports.createCard = (req, res) => {
  const {
    name,
    link,
    likes,
    createdAt,
  } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
    likes,
    createdAt,
  })
    .then((card) => res.send({
      data: card,
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

module.exports.returnCards = (req, res) => {
  Card.find(req.params)
    .then((card) => res.send({
      data: card,
    }))
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка',
    }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id).orFail(new Error('NotValidId')) // test
    .then((card) => {
      if (req.user._id !== card.owner) {
        res.status(403).send({
          message: 'Нет прав на удаление',
        });
      } else {
        Card.findByIdAndRemove(req.params.id).orFail(new Error('NotValidId'))
          .then(() => res.send({
            data: card,
          }));
      }
    })
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
