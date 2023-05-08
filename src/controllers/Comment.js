const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
  const { content, fromUser, onPost } = req.body;

  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    content,
    fromUser,
    onPost,
  });

  const post = await Post.findById(onPost);
  post.comments.push(comment._id);
  post.save();

  return comment
    .save()
    .then(comment => res.status(201).json({ comment }))
    .catch(error => res.status(500).json({ error }));
};

const readAll = async (req, res) => {
  return Comment.find()
    .populate('fromUser', 'onPost')
    .select('-__v')
    .then(comments => res.status(200).json({ comments }))
    .catch(error => res.status(500).json({ error }));
};

module.exports = { createComment, readAll };
