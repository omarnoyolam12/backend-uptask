import { CustomError } from "../../errors/custom.error";

export interface ConfirmationEntityOptions{
    id: string;
    userId: string;
    code: string;
    expiresAt: Date;
}

export class ConfirmationCodeEntity {
    constructor(
        public id: string,
        public userId: string,
        public code: string,
        public expiresAt: Date,
    ) {}

    static create(options: ConfirmationEntityOptions): ConfirmationCodeEntity {

        if(!options.id) throw CustomError.internalServer('El id es requerido');
        if(!options.userId) throw CustomError.internalServer('El id del usuario es requerido');
        if(!options.code) throw CustomError.internalServer('El código es requerido');
        if(!options.expiresAt) throw CustomError.internalServer('La fecha de expiración es requerida');

        return new ConfirmationCodeEntity(
            options.id,
            options.userId,
            options.code,
            options.expiresAt,
        );
    }
}