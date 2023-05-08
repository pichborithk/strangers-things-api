const mongoose = require('mongoose');
const User = require('../models/User');
const { random, authentication } = require('../helpers/authentication');

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!password || !username) {
      res.sendStatus(400);
      return;
    }

    const isUserExits = await User.exists({ username });
    if (isUserExits) {
      res.status(409).json({ success: false, message: 'User Exist' });
      return;
    }

    const salt = random();
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      authentication: { password: authentication(salt, password), salt },
    });
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};

const readAll = async (req, res) => {
  return User.find()
    .select('-__v')
    .then(users => res.status(200).json({ users }))
    .catch(error => res.status(500).json({ error }));
};

module.exports = { createUser, readAll };
