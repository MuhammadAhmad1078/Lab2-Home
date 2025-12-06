import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
    patient: mongoose.Types.ObjectId;
    lab: mongoose.Types.ObjectId;
    lastMessage?: string;
    lastMessageAt?: Date;
    isActive: boolean;
    unreadCount: {
        patient: number;
        lab: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        lab: {
            type: Schema.Types.ObjectId,
            ref: 'Lab',
            required: true,
        },
        lastMessage: {
            type: String,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        unreadCount: {
            patient: { type: Number, default: 0 },
            lab: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
conversationSchema.index({ patient: 1, lab: 1 }, { unique: true });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
