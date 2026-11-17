import { CustomError } from '../../errors/custom.error';

export interface UserCredentialsEntityOptions {
    id: string;
    password: string;
    email: string;
    isConfirmed: boolean;
}

export class UserCredentialsEntity {
    public readonly id: string;
    public readonly password: string;
    public readonly email: string;
    public readonly isConfirmed: boolean;

    constructor(options: UserCredentialsEntityOptions) {
        this.id = options.id;
        this.password = options.password;
        this.email = options.email;
        this.isConfirmed = options.isConfirmed;
    }

    public static fromObject(object: Record<string, any>): UserCredentialsEntity {
        const { id, _id, password, email, isConfirmed } = object;

        const userId = (id || _id)?.toString();
        if (!userId) throw CustomError.internalServer('El ID de usuario es requerido');
        if (!password) throw CustomError.internalServer('La contraseña es requerida');
        if (!email) throw CustomError.internalServer('El email del usuario es requerido');
        if (isConfirmed === undefined) throw CustomError.internalServer('El estado de confirmación es requerido');

        return new UserCredentialsEntity({
            id: userId,
            password,
            email,
            isConfirmed: Boolean(isConfirmed),
        });
    }
}