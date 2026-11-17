import { HydratedDocument, Schema, model } from 'mongoose';

export interface IUser {
    name: string;
    username: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            select: false,
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
        avatarUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const UserModel = model<IUser>('User', userSchema);
export type UserDocument = HydratedDocument<IUser>;
