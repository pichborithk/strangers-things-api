const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    posts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] },
    messages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
