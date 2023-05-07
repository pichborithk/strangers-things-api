const mongoose = require('mongoose');
const User = require('../models/User');

const createUser = async (req, res) => {
  const { username, password } = req.body;

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username,
    authentication: { password },
  });

  return user
    .save()
    .then(user => res.status(201).json({ user }))
    .catch(error => res.status(500).json({ error }));
};

const readAll = async (req, res) => {
  return User.find()
    .select('-__v')
    .then(users => res.status(200).json({ users }))
    .catch(error => res.status(500).json({ error }));
};

module.exports = { createUser, readAll };
