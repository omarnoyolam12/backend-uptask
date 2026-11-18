import { CustomError } from "../../errors/custom.error";

export interface RefreshTokenEntityOptions {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}

export class RefreshTokenEntity {
    constructor(
        public id: string,
        public userId: string,
        public token: string,
        public expiresAt: Date,
    ) {}

    static create(options: RefreshTokenEntityOptions): RefreshTokenEntity {

        if(!options.id) throw CustomError.internalServer('El id es requerido');
        if(!options.userId) throw CustomError.internalServer('El id del usuario es requerido');
        if(!options.token) throw CustomError.internalServer('El token es requerido');
        if(!options.expiresAt) throw CustomError.internalServer('La fecha de expiración es requerida');

        return new RefreshTokenEntity(
            options.id,
            options.userId,
            options.token,
            options.expiresAt,
        );
    }
}

    