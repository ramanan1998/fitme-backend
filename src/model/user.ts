import mongoose, { Schema } from "mongoose";
import { UserType } from "../types";

const UserSchema = new Schema<UserType>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, required: true },
}, {
    timestamps: true
});

export const userModel = mongoose.model<UserType>("users", UserSchema);