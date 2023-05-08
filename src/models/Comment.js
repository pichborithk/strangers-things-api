const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, require: true },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      Ref: 'User',
    },
    onPost: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      Ref: 'Post',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
