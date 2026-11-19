import { CustomError } from '../../errors/custom.error';

export interface ConfirmationCodeEntityOptions {
    id: string;
    userId: string;
    code: string;
    expiresAt: Date;
}

export class ConfirmationCodeEntity {
    public readonly id: string;
    public readonly userId: string;
    public readonly code: string;
    public readonly expiresAt: Date;

    constructor(options: ConfirmationCodeEntityOptions) {
        this.id = options.id;
        this.userId = options.userId;
        this.code = options.code;
        this.expiresAt = options.expiresAt;
    }

    public static fromObject(object: Record<string, any>): ConfirmationCodeEntity {
        const { id, _id, userId, user, code, expiresAt } = object;

        const entityId = (id || _id)?.toString();
        const ownerId = (userId || user)?.toString();

        if (!entityId) throw CustomError.internalServer('El id es requerido');
        if (!ownerId) throw CustomError.internalServer('El id del usuario es requerido');
        if (!code) throw CustomError.internalServer('El código es requerido');
        if (!expiresAt) throw CustomError.internalServer('La fecha de expiración es requerida');

        return new ConfirmationCodeEntity({
            id: entityId,
            userId: ownerId,
            code,
            expiresAt: expiresAt instanceof Date ? expiresAt : new Date(expiresAt),
        });
    }
}
