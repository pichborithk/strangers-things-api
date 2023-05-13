const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      Ref: 'User',
    },
    content: { type: String, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Message', MessageSchema);
