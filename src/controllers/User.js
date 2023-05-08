const mongoose = require('mongoose');
const User = require('../models/User');
const { random, authentication } = require('../helpers/authentication');

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!password || !username) {
      res.status(400).json({ success: false, message: 'Missing information' });
      return;
    }

    const isUserExits = await User.exists({ username });
    if (isUserExits) {
      res.status(409).json({ success: false, message: 'User Already Exist' });
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

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!password || !username) {
      res.sendStatus(400);
      return;
    }

    const user = await User.findOne({ username }).select(
      '+authentication.salt +authentication.password'
    );

    if (!user._id) {
      res.status(409).json({ success: false, message: 'User Do Not Exist' });
      return;
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      res.send(403).json({ success: false, message: 'Wrong Password' });
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie('AUTH-STRANGERS-THINGS-API', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });

    res.status(200).json(user).end();
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};

const readAll = async (req, res) => {
  return User.find()
    .populate({
      path: 'posts',
      select: '-__v',
      populate: {
        path: 'comments',
        model: 'Comment',
        select: '-updatedAt -createdAt -__v -onPost',
      },
    })
    .select('-__v')
    .then(users => res.status(200).json({ users }))
    .catch(error => res.status(500).json({ error }));
};

module.exports = { createUser, readAll, loginUser };
