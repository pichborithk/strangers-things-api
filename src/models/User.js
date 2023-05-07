const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      // salt: { type: String, select: false },
      // sessionToken: { type: String, select: false },
    },
    updatedAt: { type: Date, select: false },
    createdAt: { type: Date, select: false },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
