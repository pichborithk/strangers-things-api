const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);
