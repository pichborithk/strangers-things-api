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
    conversations: {
      type: [
        {
          type: {
            withUser: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              Ref: 'User',
            },
            messages: [
              {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Message',
              },
            ],
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('User', UserSchema);
