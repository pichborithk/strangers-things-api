const mongoose = require('mongoose');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, author } = req.body;

  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title,
    author,
  });

  return post
    .save()
    .then(post => res.status(201).json({ post }))
    .catch(error => res.status(500).json({ error }));
};

const readAll = async (req, res) => {
  return Post.find()
    .populate('author', '-__v -updatedAt -createdAt')
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
