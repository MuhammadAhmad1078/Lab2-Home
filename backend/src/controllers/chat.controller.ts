import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import Booking from '../models/Booking';
import { Server } from 'socket.io';

// Helper to get IO instance (will be attached to req in server.ts or we can export a setter)
let io: Server;
export const setIO = (socketIO: Server) => {
    io = socketIO;
};

// Create or Get Conversation
export const createConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { targetUserId } = req.body; // Lab ID if patient, Patient ID if lab
        const userId = req.user?.id;
        const userType = req.user?.userType;

        if (!userId || !userType) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        let patientId, labId;

        if (userType === 'patient') {
            patientId = userId;
            labId = targetUserId;
        } else if (userType === 'lab') {
            patientId = targetUserId;
            labId = userId;
        } else {
            res.status(403).json({ success: false, message: 'Only patients and labs can chat' });
            return;
        }

        // Check if booking exists
        const bookingExists = await Booking.exists({
            patient: patientId,
            lab: labId,
        });

        if (!bookingExists) {
            res.status(403).json({ success: false, message: 'You can only chat if there is a booking history.' });
            return;
        }

        // Check if conversation exists
        let conversation = await Conversation.findOne({ patient: patientId, lab: labId });

        if (!conversation) {
            conversation = await Conversation.create({
                patient: patientId,
                lab: labId,
            });
        }

        res.status(200).json({ success: true, conversation });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Conversations
export const getConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const userType = req.user?.userType;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const query = userType === 'patient' ? { patient: userId } : { lab: userId };

        const conversations = await Conversation.find(query)
            .populate('patient', 'fullName email')
            .populate('lab', 'labName email')
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, conversations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send Message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('sendMessage called');
        const { conversationId, content } = req.body;
        const userId = req.user?.id;
        const userType = req.user?.userType;
        const files = req.files as Express.Multer.File[];

        console.log('Request body:', req.body);
        console.log('User:', userId, userType);
        console.log('Files:', files ? files.length : 'No files');

        if (!userId || !userType) {
            console.log('Unauthorized: Missing user info');
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        // Verify conversation participation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            console.log('Conversation not found:', conversationId);
            res.status(404).json({ success: false, message: 'Conversation not found' });
            return;
        }

        if (
            (userType === 'patient' && conversation.patient.toString() !== userId) ||
            (userType === 'lab' && conversation.lab.toString() !== userId)
        ) {
            console.log('User not authorized for this conversation');
            res.status(403).json({ success: false, message: 'Not authorized to send message to this conversation' });
            return;
        }

        // Process attachments
        const attachments = files?.map((file) => ({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer,
            size: file.size,
        })) || [];

        console.log('Processed attachments:', attachments.map(a => ({ ...a, data: 'BUFFER' })));

        // Create Message
        console.log('Creating message...');
        const message = await Message.create({
            conversation: conversationId,
            sender: userType,
            senderId: userId,
            content,
            attachments,
            status: 'sent',
        });
        console.log('Message created:', message._id);

        // Update Conversation
        conversation.lastMessage = content || (attachments.length > 0 ? 'Attachment' : '');
        conversation.lastMessageAt = new Date();

        // Increment unread count for recipient
        if (userType === 'patient') {
            conversation.unreadCount.lab += 1;
        } else {
            conversation.unreadCount.patient += 1;
        }
        await conversation.save();
        console.log('Conversation updated');

        // Emit Socket Event (Exclude data buffer for performance)
        const messageForSocket: any = message.toObject();
        messageForSocket.attachments = messageForSocket.attachments.map((att: any) => ({
            _id: att._id,
            filename: att.filename,
            contentType: att.contentType,
            size: att.size,
            // Exclude data buffer
        }));

        if (io) {
            io.to(conversationId).emit('new_message', messageForSocket);
        }

        // Response (Exclude data buffer)
        res.status(201).json({ success: true, message: messageForSocket });
    } catch (error: any) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Messages
export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.id;

        // Verify participation (optional but recommended)
        // ...

        const messages = await Message.find({ conversation: conversationId })
            .sort({ createdAt: 1 })
            .select('-attachments.data'); // Exclude buffer data

        res.status(200).json({ success: true, messages });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark Messages as Read
export const markMessagesAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.id;
        const userType = req.user?.userType;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        await Message.updateMany(
            { conversation: conversationId, senderId: { $ne: userId }, status: { $ne: 'read' } },
            { status: 'read' }
        );

        // Reset unread count
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            if (userType === 'patient') {
                conversation.unreadCount.patient = 0;
            } else {
                conversation.unreadCount.lab = 0;
            }
            await conversation.save();
        }

        if (io) {
            io.to(conversationId).emit('messages_read', { conversationId, userId });
        }

        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Attachment
export const getAttachment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { messageId, attachmentIndex } = req.params;

        const message = await Message.findById(messageId);
        if (!message || !message.attachments[Number(attachmentIndex)]) {
            res.status(404).json({ success: false, message: 'Attachment not found' });
            return;
        }

        const attachment = message.attachments[Number(attachmentIndex)];

        res.set('Content-Type', attachment.contentType);
        res.set('Content-Disposition', `inline; filename="${attachment.filename}"`);
        res.send(attachment.data);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
