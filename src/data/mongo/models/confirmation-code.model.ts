import { HydratedDocument, Schema, Types, model } from 'mongoose';

export interface IConfirmationCode {
    user: Types.ObjectId;
    code: string;
    expiresAt: Date;
    createdAt?: Date;
}

const confirmationCodeSchema = new Schema<IConfirmationCode>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El usuario es requerido'],
        },
        code: {
            type: String,
            required: [true, 'El código es requerido'],
            trim: true,
            match: [/^\d{6}$/, 'El código debe tener 6 dígitos'],
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

confirmationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ConfirmationCodeModel = model<IConfirmationCode>('ConfirmationCode', confirmationCodeSchema);
export type ConfirmationCodeDocument = HydratedDocument<IConfirmationCode>;
