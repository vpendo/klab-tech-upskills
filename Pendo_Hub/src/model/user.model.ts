import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";

    // Password reset fields
    resetOTP?: string | undefined;
    resetOTPExpires?: Date | undefined;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },

        // Password reset OTP
        resetOTP: {
            type: String,
        },

        // OTP expiration time
        resetOTPExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;