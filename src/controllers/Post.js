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

const updatePost = async (req, res) => {
  const sessionToken = req.headers.authorization;
  if (!sessionToken) {
    res.status(403).json({ success: false, message: 'Please login to edit' });
    return;
  }

  const { postId } = req.params;

  if (!postId) {
    res.status(403).json({ success: false, message: 'Post does not exist' });
    return;
  }

  const post = await Post.findById(postId)
    .populate('author', '-__v -updatedAt -createdAt -posts -messages -username')
    .select('-__v');

  if (!post || !post._id) {
    res.status(403).json({ success: false, message: 'Post does not exist' });
    return;
  }

  const { title, description, price, willDeliver, location } = req.body;

  if (!title || !description || !price || typeof willDeliver !== 'boolean') {
    res.status(400).json({ success: false, message: 'Missing information' });
    return;
  }

  const user = await User.findOne({
    'authentication.sessionToken': sessionToken,
  });

  if (!user._id || user.id !== post.author.id) {
    res.status(403).json({ success: false, message: 'Unauthorized' });
    return;
  }
  post.title = title;
  post.description = description;
  post.price = price;
  post.willDeliver = willDeliver;
  post.location = location;
  await post.save();

  res.status(200).json({ success: true, data: post });
  return;
};

module.exports = { createPost, readAll, updatePost };
