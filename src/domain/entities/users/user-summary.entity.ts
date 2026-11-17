import { CustomError } from '../../errors/custom.error';

export interface UserSummaryEntityOptions {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
}

export class UserSummaryEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly username: string;
    public readonly avatarUrl?: string;

    constructor(options: UserSummaryEntityOptions) {
        this.id = options.id;
        this.name = options.name;
        this.username = options.username;
        this.avatarUrl = options.avatarUrl;
    }

    public static fromObject(object: Record<string, any>): UserSummaryEntity {
        const { id, _id, name, username, avatarUrl } = object;

        const userId = (id || _id)?.toString();
        if (!userId) throw CustomError.internalServer('El ID de usuario es requerido');
        if (!name) throw CustomError.internalServer('El nombre es requerido');
        if (!username) throw CustomError.internalServer('El email es requerido');

        return new UserSummaryEntity({
            id: userId,
            name,
            username,
            avatarUrl
        });
    }
}