import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
    userId: Types.ObjectId;
    title: string;
    slug: string;
    description?: string;
    duration: number; // in minutes
    color: string;
    isActive: boolean;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        duration: {
            type: Number,
            required: [true, "Duration is required"],
            enum: [15, 30, 45, 60, 90, 120],
            default: 30,
        },
        color: {
            type: String,
            default: "#6366f1", // indigo
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        location: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Compound index: each user can have unique slug per their account
EventSchema.index({ userId: 1, slug: 1 }, { unique: true });

const Event: Model<IEvent> =
    mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;
