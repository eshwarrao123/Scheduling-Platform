import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBooking extends Document {
    userId: Types.ObjectId;
    eventId?: Types.ObjectId;
    name: string;
    email: string;
    selectedDate: string; // ISO date string, e.g., "2023-11-01"
    selectedTime: string; // "HH:MM" e.g., "14:30"
    timezone?: string;
    calendarSynced?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            index: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: false,
        },
        name: {
            type: String,
            required: [true, "Guest name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Guest email is required"],
            lowercase: true,
            trim: true,
        },
        selectedDate: {
            type: String,
            required: [true, "Date is required"],
            match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
            index: true,
        },
        selectedTime: {
            type: String,
            required: [true, "Time is required"],
            match: [/^\d{2}:\d{2}$/, "Time must be in HH:MM format"],
        },
        timezone: {
            type: String,
            required: false,
        },
        calendarSynced: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Prevent double booking at the database level!
BookingSchema.index({ userId: 1, selectedDate: 1, selectedTime: 1 }, { unique: true });

const Booking: Model<IBooking> =
    mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
