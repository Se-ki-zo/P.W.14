const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // test
  let payload;
  try {
    const token = req.headers.cookie.replace('jwt=', '');
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({
        message: 'Необходима авторизация',
      });
  }

  req.user = payload;

  return next();
};
