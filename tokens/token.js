const jwt = require("jsonwebtoken");
const config = require("../db/config/config.json");

module.exports.createToken = (information) => {
  return jwt.sign(
    { expiresIn: Math.floor(Date.now() / 1000) + 3600, data: information },
    config.token.secret
  );
};

module.exports.verifyToken = (token) => {
  console.log(jwt.decode(token));
  return jwt.verify(token, config.token.secret);
};