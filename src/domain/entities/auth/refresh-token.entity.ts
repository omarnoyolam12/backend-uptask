import { CustomError } from '../../errors/custom.error';

export interface RefreshTokenEntityOptions {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}

export class RefreshTokenEntity {
    public readonly id: string;
    public readonly userId: string;
    public readonly token: string;
    public readonly expiresAt: Date;

    constructor(options: RefreshTokenEntityOptions) {
        this.id = options.id;
        this.userId = options.userId;
        this.token = options.token;
        this.expiresAt = options.expiresAt;
    }

    public static fromObject(object: Record<string, any>): RefreshTokenEntity {
        const { id, _id, userId, user, token, tokenHash, expiresAt } = object;

        const entityId = (id || _id)?.toString();
        const ownerId = (userId || user)?.toString();
        const tokenValue = token || tokenHash;

        if (!entityId) throw CustomError.internalServer('El id es requerido');
        if (!ownerId) throw CustomError.internalServer('El id del usuario es requerido');
        if (!tokenValue) throw CustomError.internalServer('El token es requerido');
        if (!expiresAt) throw CustomError.internalServer('La fecha de expiración es requerida');

        return new RefreshTokenEntity({
            id: entityId,
            userId: ownerId,
            token: tokenValue,
            expiresAt: expiresAt instanceof Date ? expiresAt : new Date(expiresAt),
        });
    }
}
