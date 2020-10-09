const router = require('express').Router();
const User = require('../controllers/users.js');

router.get('/users/:id', User.findUser);
router.get('/users', User.returnUsers);
// router.post('/users', User.createUser);
router.post('/signin', User.login);
router.post('/signup', User.createUser);

module.exports = router;
