const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const createComment = async (req, res) => {
  try {
    const sessionToken = req.cookies['AUTH-STRANGERS-THINGS-API'];
    if (!sessionToken) {
      res
        .status(403)
        .json({ success: false, message: 'Please login to make new comment' });
      return;
    }

    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    });
    if (!user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { content, onPost } = req.body;

    if (!content || !onPost) {
      res.sendStatus(400);
      return;
    }

    const post = await Post.findById(onPost);
    if (!post._id) {
      res.status(404).json({ success: false, message: 'Post does not exist' });
      return;
    }

    const comment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      content,
      fromUser: user._id,
      onPost,
    });

    post.comments.push(comment._id);

    await post.save();
    await comment.save();
    res.status(201).json({ comment });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};

const readAll = async (req, res) => {
  return Comment.find()
    .populate('fromUser', 'onPost')
    .select('-__v')
    .then(comments => res.status(200).json({ comments }))
    .catch(error => res.status(500).json({ error }));
};

module.exports = { createComment, readAll };
