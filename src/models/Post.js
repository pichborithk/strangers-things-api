const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: String, require: true },
    location: { type: String, require: true },
    willDeliver: { type: Boolean, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
    isAuthor: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);
