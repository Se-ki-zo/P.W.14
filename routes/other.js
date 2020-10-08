const router = require('express').Router();
// const path = require('path');

router.get('/*', (req, res) => { // bad url
  res.status(404).send(JSON.stringify({
    message: 'Запрашиваемый ресурс не найден',
  }));
});

module.exports = router;
