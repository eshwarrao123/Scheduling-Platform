import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    passwordHash: string;
    image?: string;
    timezone: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            select: false, // never returned in queries by default
        },
        image: {
            type: String,
        },
        timezone: {
            type: String,
            default: "UTC",
        },
        bio: {
            type: String,
            maxlength: [300, "Bio cannot exceed 300 characters"],
        },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
