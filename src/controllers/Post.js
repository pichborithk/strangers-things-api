const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  try {
    const sessionToken = req.cookies['AUTH-STRANGERS-THINGS-API'];
    console.log(sessionToken);
    if (!sessionToken) {
      res
        .status(403)
        .json({ success: false, message: 'Please login to make new post' });
      return;
    }

    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    });
    console.log(user);

    if (!user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title } = req.body;
    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      title,
      author: user._id,
    });
    user.posts.push(post._id);
    await post.save();
    await user.save();
    res.status(201).json({ post });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }

  // const post = new Post({
  //   _id: new mongoose.Types.ObjectId(),
  //   title,
  //   author,
  // });

  // return post
  //   .save()
  //   .then(post => res.status(201).json({ post }))
  //   .catch(error => res.status(500).json({ error }));
};

const readAll = async (req, res) => {
  return Post.find()
    .populate('author', '-__v -updatedAt -createdAt -posts -messages')
    .populate({
      path: 'comments',
      select: '-updatedAt -createdAt -onPost',
      populate: {
        path: 'fromUser',
        model: 'User',
        select: '-updatedAt -createdAt -__v',
      },
    })
    .select('-__v')
    .then(posts => res.status(200).json({ posts }))
    .catch(error => res.status(500).json({ error }));
};

module.exports = { createPost, readAll };
