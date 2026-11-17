import { CustomError } from '../../errors/custom.error';

export interface UserEntityOptions {
    id: string;
    name: string;
    username: string;
    email: string;
    isConfirmed: boolean;
    createdAt: Date;
    avatarUrl?: string;
}

export class UserEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly username: string;
    public readonly email: string;
    public readonly isConfirmed: boolean;
    public readonly createdAt: Date;
    public readonly avatarUrl?: string;

    constructor(options: UserEntityOptions) {
        this.id = options.id;
        this.name = options.name;
        this.username = options.username;
        this.email = options.email;
        this.isConfirmed = options.isConfirmed;
        this.createdAt = options.createdAt;
        this.avatarUrl = options.avatarUrl;
    }

    public static fromObject(object: Record<string, any>): UserEntity {
        const { id, _id, name, username, email, avatarUrl, isConfirmed, createdAt } = object;

        const userId = (id || _id)?.toString();
        if (!userId) throw CustomError.internalServer('El id es requerido');
        if (!name) throw CustomError.internalServer('El nombre es requerido');
        if (!username) throw CustomError.internalServer('El nombre de usuario es querido');
        if (!email) throw CustomError.internalServer('El email es requerido');
        if (isConfirmed === undefined) throw CustomError.internalServer('La confirmación de la cuenta es necesaria');
        if (!createdAt) throw CustomError.internalServer('La fecha de creación es necesaria');

        return new UserEntity({
            id: userId,
            name,
            username,
            email,
            isConfirmed: Boolean(isConfirmed),
            createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
            avatarUrl: avatarUrl
        });
    }
}