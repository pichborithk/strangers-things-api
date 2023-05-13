const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const createComment = async (req, res) => {
  try {
    // const sessionToken = req.cookies['AUTH-STRANGERS-THINGS-API'];
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      res
        .status(403)
        .json({ success: false, message: 'Please login to make new comment' });
      return;
    }

    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    });

    const { postId } = req.params;

    if (!user._id || !postId) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post || !post._id || !post.active) {
      res.status(404).json({ success: false, message: 'Post does not exist' });
      return;
    }

    const { content } = req.body;

    if (!content) {
      res.sendStatus(400);
      return;
    }

    const comment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      content,
      fromUser: user._id,
      onPost: postId,
    });

    post.comments.push(comment._id);

    await post.save();
    await comment.save();
    res.status(201).json({
      success: true,
      message: 'Success add new comment',
      data: comment,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error });
    return;
  }
};

const readAll = async (req, res) => {
  return Comment.find()
    .select('-__v')
    .then(comments => res.status(200).json({ comments }))
    .catch(error => res.status(500).json({ error }));
};

const deleteComment = async (req, res) => {
  try {
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      res.status(403).json({ success: false, message: 'Please login...' });
      return;
    }

    const { postId } = req.params;

    if (!postId) {
      res.status(403).json({ success: false, message: 'Post does not exist' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post || !post._id || !post.active) {
      res.status(404).json({ success: false, message: 'Post does not exist' });
      return;
    }

    const { commentId } = req.body;

    if (!commentId) {
      res.sendStatus(400);
      return;
    }
    const comment = await Comment.findOne({ _id: commentId }).populate({
      path: 'fromUser',
      model: 'User',
      select: '-updatedAt -createdAt -__v -messages -posts',
    });

    if (!comment || !comment._id) {
      res
        .status(404)
        .json({ success: false, message: 'Comment does not exist' });
      return;
    }

    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    });

    if (!user._id || comment.fromUser.id !== user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const indexOfComment = post.comments.indexOf(comment._id);
    if (indexOfComment < 0) {
      res
        .status(404)
        .json({ success: false, message: 'Comment does not exist' });
      return;
    }

    post.comments.splice(indexOfComment, 1);
    await Comment.findByIdAndDelete(commentId);

    await post.save();
    res.status(201).json({
      success: true,
      message: 'Success delete new comment',
      data: comment,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error });
    return;
  }
};

module.exports = { createComment, readAll, deleteComment };
