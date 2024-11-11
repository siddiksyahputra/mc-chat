const { ConversationModel } = require("../model/conversationModel");

const getConversation = async (currentUserId) => {
    if (!currentUserId) {
        throw new Error('currentUser Id is required');
    }

    const currentConversation = await ConversationModel.find({
        '$or': [
            { sender: currentUserId }, 
            { receiver: currentUserId }
        ]
    }).sort({ updateAt: -1 })
    .populate('messages')
    .populate('sender')
    .populate('receiver');

    const conversation = currentConversation.map((conv) => {
        const countunseenMsg = conv.messages.reduce((prev, curr) => prev + (curr.seen ? 0 : 1), 0);
        
        const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;

        return {
            _id: conv?._id,
            sender: conv?.sender,
            receiver: conv?.receiver,
            unseenMsg: countunseenMsg,
            lastMsg: lastMsg
        };
    });

    return conversation;
}

module.exports = getConversation;