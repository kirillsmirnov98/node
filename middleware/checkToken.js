const checkToken = require('../tokens/token');

module.exports.tokenChecking = (req, res, next) => {
  const { token } = req.headers;
  
  try {
    checkToken.verifyToken(token);
  } catch (err) {
    return res.status(404).send("Token is out of date or invalid");
  }
  
  return next();
};