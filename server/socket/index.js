const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailFromToken = require('../helper/getUserDetailFromToken');
const getConversation = require('../helper/getConversation');
const userModel = require('../model/userModel');
const { ConversationModel, MessageModel } = require('../model/conversationModel');

class SocketServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: process.env.FRONTEND_URL || 3000,
                credentials: true
            }
        });
        this.onlineUsers = new Set();
        this.initializeSocketEvents();
    }

    initializeSocketEvents() {
        this.io.on('connection', this.handleConnection.bind(this));
    }

    async handleConnection(socket) {
        try {
            const token = socket.handshake.auth.token;
            const user = await getUserDetailFromToken(token);

            if (!user) {
                socket.disconnect(true);
                return;
            }

            this.setupUserConnection(socket, user);
            this.setupMessagePageListener(socket, user);
            this.setupNewMessageListener(socket, user);
            this.setupSidebarListener(socket);
            this.setupDisconnectHandler(socket, user);
        } catch (error) {
            console.error('Connection error:', error);
            socket.disconnect(true);
        }
    }

    setupUserConnection(socket, user) {
        socket.join(user._id.toString());
        this.onlineUsers.add(user._id.toString());
        this.io.emit('onlineUser', Array.from(this.onlineUsers));
    }

    setupMessagePageListener(socket, user) {
        socket.on('message-page', async (userId) => {
            try {
                const userDetails = await this.getUserDetails(userId);
                const payload = this.createUserPayload(userDetails, userId);
                socket.emit('message-user', payload);

                const conversationMessages = await this.getConversationMessages(user._id, userId);
                socket.emit('message', conversationMessages);
            } catch (error) {
                console.error('Message page error:', error);
                socket.emit('error', { message: 'Failed to load message page' });
            }
        });
    }

    async getUserDetails(userId) {
        return await userModel.findById(userId).select('-password');
    }

    createUserPayload(userDetails, userId) {
        return {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: this.onlineUsers.has(userId)
        };
    }

    async getConversationMessages(currentUserId, userId) {
        const conversation = await ConversationModel.findOne({
            "$or": [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).populate('messages').sort({ updatedAt: -1 });

        return conversation ? conversation.messages : [];
    }

    setupNewMessageListener(socket, user) {
        socket.on('new-message', async (data) => {
            try {
                const conversation = await this.findOrCreateConversation(data);
                const savedMessage = await this.createAndSaveMessage(data);
                await this.updateConversation(conversation, savedMessage);
    
                const updatedMessages = await this.getUpdatedConversationMessages(data);
                this.broadcastMessages(data, updatedMessages);
    
                // Fetch updated conversations for both sender and receiver
                const senderConversations = await getConversation(data.sender);
                const receiverConversations = await getConversation(data.receiver);
    
                // Emit updated conversations to both sender and receiver
                this.io.to(data.sender).emit('conversation', senderConversations);
                this.io.to(data.receiver).emit('conversation', receiverConversations);
            } catch (error) {
                console.error('New message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
    }

    async findOrCreateConversation(data) {
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]
        });

        if (!conversation) {
            conversation = await new ConversationModel({
                sender: data.sender,
                receiver: data.receiver,
                messages: []
            }).save();
        }

        return conversation;
    }

    async createAndSaveMessage(data) {
        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data.msgByUserId
        });

        return await message.save();
    }

    async updateConversation(conversation, message) {
        await ConversationModel.updateOne(
            { _id: conversation._id },
            { "$push": { messages: message._id } }
        );
    }

    async getUpdatedConversationMessages(data) {
        const conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 });

        return conversation ? conversation.messages : [];
    }

    broadcastMessages(data, messages) {
        this.io.to(data.sender).emit('message', messages);
        this.io.to(data.receiver).emit('message', messages);
    }

    setupSidebarListener(socket) {
        socket.on('sidebar', async (currentUserId) => {
            try {
                const conversations = await getConversation(currentUserId);
                socket.emit('conversation', conversations);
            } catch (error) {
                console.error('Sidebar error:', error);
                socket.emit('error', { message: 'Failed to fetch conversations' });
            }
        });
    }

    setupDisconnectHandler(socket, user) {
        socket.on('disconnect', () => {
            if (user?._id) {
                this.onlineUsers.delete(user._id.toString());
                this.io.emit('onlineUser', Array.from(this.onlineUsers));
            }
        });
    }
}

const socketServer = new SocketServer();

module.exports = {
    app: socketServer.app,
    server: socketServer.server
};