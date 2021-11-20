const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const user = require("../db/models/user");
const token = require("../tokens/token.js");
const path = require('path');

module.exports.register = async function (req, res) {
  const { name, email, password, dob } = req.body;

  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ message: 'Registration error!', error });
    }
    const candidate = await db.User.findOne({ where: { email: email } });
    if (candidate) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // if (password.length < 4) {
    //   return res.status(400).json({ message: 'Password to short' });
    // }
    const salt = bcrypt.genSaltSync(10);

    const user = await db.User.create({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, salt),
      dob: dob
    });

    res.status(201).json({ message: user });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ message: 'Login error!' });
    }
    const user = await db.User.findOne({ where: { email: email } });
    let userToken;
    if (!user) {
      res.status(404).json({ message: 'User not found!' });
      return;
    }    
    const validPassword = bcrypt.compareSync(password, user.password);
    if (validPassword) {
      userToken = token.createToken(user.id);
      res.send({ token: userToken });
    } else {
      res.status(400).json({ message: 'Invalid password!' });
      return;
    }

    // res.status(200).json({ message: 'Login is successful' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong!!' });
  }
};

module.exports.delete = async function (req, res) {
  const { id } = req.body;

  try {
    const user = await db.User.findOne({ where: { id: id } });

    if (!user) {
      res.status(404).json({ message: `User with this id ${id} was not found` });
      return;
    }
    await user.destroy({ where: { id: id } });
    res.status(200).json({ message: `User with this id ${id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports.getUsers = async function (req, res) {
  try {
    const users = await db.User.findAll({
      raw: true,
      attributes: ['id', 'name', 'email', 'dob'],
    });

    if (users.length === 0) {
      res.status(404).json({ message: "No registered users" });
      return;
    }

    res.status(200).json({ message: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong', data: err });
  }
};

module.exports.update = async function (req, res) {
  const { email, name } = req.body;
  try {
    const user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      res.status(404).json({ message: 'User not found!' });
      return;
    }

    await user.update(
      { name: name },
      { where: { email: email } },
    );
    res.status(200).json({ message: `User ${user.id}: username changed. New name: ${name}` });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};