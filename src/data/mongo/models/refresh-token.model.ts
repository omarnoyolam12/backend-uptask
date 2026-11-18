import { HydratedDocument, Schema, Types, model } from 'mongoose';

export interface IRefreshToken {
    user: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El usuario es requerido'],
        },
        tokenHash: {
            type: String,
            required: [true, 'El hash del token es requerido'],
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: [true, 'La fecha de expiración es requerida'],
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
    },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export type RefreshTokenDocument = HydratedDocument<IRefreshToken>;
