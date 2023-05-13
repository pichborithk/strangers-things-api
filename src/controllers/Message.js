const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

const createMessage = async (req, res) => {
  try {
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      res
        .status(403)
        .json({ success: false, message: 'Please login to send message' });
      return;
    }

    const sender = await User.findOne({
      'authentication.sessionToken': sessionToken,
    }).populate({
      path: 'conversations',
      populate: { path: 'withUser', model: 'User' },
    });

    if (!sender || !sender._id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { receiverId } = req.params;
    const receiver = await User.findById(receiverId).populate({
      path: 'conversations',
      populate: { path: 'withUser', model: 'User' },
    });

    if (!receiver || !receiver._id) {
      res.status(404).json({ success: false, message: 'User does not exist' });
      return;
    }

    const { content } = req.body;
    if (!content) {
      res.sendStatus(400);
      return;
    }

    const message = new Message({
      _id: new mongoose.Types.ObjectId(),
      content,
      fromUser: sender._id,
    });

    const senderConversation = sender.conversations.find(
      conversation => conversation.withUser.id === receiver.id
    );
    if (senderConversation) {
      senderConversation.messages.push(message);
    } else {
      sender.conversations.push({
        withUser: receiver._id,
        messages: [message],
      });
    }

    const receiverConversation = receiver.conversations.find(
      conversation => conversation.withUser.id === sender.id
    );

    if (receiverConversation) {
      receiverConversation.messages.push(message);
    } else {
      receiver.conversations.push({
        withUser: sender._id,
        messages: [message],
      });
    }

    await message.save();
    await sender.save();
    await receiver.save();
    res.status(201).json({
      success: true,
      message: 'Success send message',
      data: message,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};

module.exports = { createMessage };
