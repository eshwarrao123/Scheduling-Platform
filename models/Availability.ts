import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type DayOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export interface IAvailability extends Document {
    userId: Types.ObjectId;
    day: DayOfWeek;
    startTime: string; // "HH:MM" in 24-hour format, e.g. "09:00"
    endTime: string;   // "HH:MM" in 24-hour format, e.g. "17:00"
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            index: true,
        },
        day: {
            type: String,
            enum: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ],
            required: [true, "Day is required"],
        },
        startTime: {
            type: String,
            required: [true, "Start time is required"],
            match: [/^\d{2}:\d{2}$/, "Time must be in HH:MM format"],
        },
        endTime: {
            type: String,
            required: [true, "End time is required"],
            match: [/^\d{2}:\d{2}$/, "Time must be in HH:MM format"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// A user can only have one slot per day (enforce with compound unique index)
AvailabilitySchema.index({ userId: 1, day: 1 }, { unique: true });


const Availability: Model<IAvailability> =
    mongoose.models.Availability ??
    mongoose.model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;
