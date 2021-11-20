const express = require('express');
const controllers = require("../controllers/auth");
const { check } = require("express-validator");
const router = express.Router();
const token = require('../middleware/checkToken');

router.post('/register', [
  check('name', 'Name is too short!').notEmpty(),
  check('password', 'Password is too short!').isLength({ min: 4}),
  check('email', 'Incorrect email!').isEmail(),
  check('dob', 'Please enter the correct date').notEmpty(),
], controllers.register);

router.post('/login', [
  check('password', 'Password is too short!').isLength({ min: 4, max: 40 }),
  check('email', 'Incorrect email!').isEmail(),
], controllers.login);

router.delete('/delete', token.tokenChecking, controllers.delete);
router.get('/get', token.tokenChecking, controllers.getUsers);
router.post('/update', token.tokenChecking, controllers.update);

module.exports = router;