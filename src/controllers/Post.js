const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  try {
    // const sessionToken = req.cookies['AUTH-STRANGERS-THINGS-API'];
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      res
        .status(403)
        .json({ success: false, message: 'Please login to make new post' });
      return;
    }

    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    });

    if (!user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title, description, price, willDeliver, location } = req.body;

    if (!title || !description || !price || typeof willDeliver !== 'boolean') {
      res.status(400).json({ success: false, message: 'Missing information' });
      return;
    }

    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      price,
      willDeliver,
      location: location ? location : '[On Request]',
      author: user._id,
    });

    user.posts.push(post._id);
    await post.save();
    await user.save();
    res
      .status(201)
      .json({ success: true, message: 'Success add new post', data: post });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error });
    return;
  }
};

const readAll = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', '-__v -updatedAt -createdAt -posts -messages')
      .populate({
        path: 'comments',
        select: '-updatedAt -createdAt -onPost',
        populate: {
          path: 'fromUser',
          model: 'User',
          select: '-updatedAt -createdAt -__v -messages -posts',
        },
      })
      .select('-__v');
    const sessionToken = req.headers.authorization;

    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    });

    posts.forEach(post => {
      if (user && post.author.id === user.id) {
        post.isAuthor = true;
      }
    });

    res.status(200).json({ success: true, data: posts });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error });
    return;
  }
};

module.exports = { createPost, readAll };
