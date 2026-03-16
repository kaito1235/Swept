const conversationModel = require('../models/conversation.model');
const messageModel = require('../models/message.model');
const { success, error, notFound, forbidden } = require('../utils/apiResponse');

async function listConversations(req, res) {
  try {
    const conversations = await conversationModel.findByUserId(req.user.id);
    return success(res, conversations);
  } catch (err) {
    console.error('messages.listConversations error:', err);
    return error(res, 'Failed to load conversations');
  }
}

async function getOrCreateConversation(req, res) {
  const { cleanerId } = req.body;
  try {
    const conversation = await conversationModel.findOrCreate({
      hostId: req.user.id,
      cleanerId,
    });
    return success(res, conversation, 201);
  } catch (err) {
    console.error('messages.getOrCreate error:', err);
    return error(res, 'Failed to create conversation');
  }
}

async function getMessages(req, res) {
  try {
    const conversation = await conversationModel.findById(req.params.id);
    if (!conversation) return notFound(res, 'Conversation not found');

    const isParticipant =
      conversation.host_id === req.user.id ||
      conversation.cleaner_id === req.user.id;
    if (!isParticipant) return forbidden(res);

    await messageModel.markRead(req.params.id, req.user.id);
    const messages = await messageModel.findByConversationId(req.params.id);
    return success(res, { conversation, messages });
  } catch (err) {
    console.error('messages.getMessages error:', err);
    return error(res, 'Failed to load messages');
  }
}

async function sendMessage(req, res) {
  const { body } = req.body;
  try {
    const conversation = await conversationModel.findById(req.params.id);
    if (!conversation) return notFound(res, 'Conversation not found');

    const isParticipant =
      conversation.host_id === req.user.id ||
      conversation.cleaner_id === req.user.id;
    if (!isParticipant) return forbidden(res);

    const message = await messageModel.create({
      conversationId: req.params.id,
      senderId: req.user.id,
      body,
    });
    return success(res, message, 201);
  } catch (err) {
    console.error('messages.sendMessage error:', err);
    return error(res, 'Failed to send message');
  }
}

module.exports = { listConversations, getOrCreateConversation, getMessages, sendMessage };
