const router = require('express').Router();
const Cards = require('../controllers/cards.js');

router.delete('/cards/:id', Cards.deleteCard);
router.get('/cards', Cards.returnCards);
router.post('/cards', Cards.createCard);

module.exports = router;
