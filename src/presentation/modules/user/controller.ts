import { Request, Response } from "express";

import { UserRepository } from "../../../domain/repositories/user.repository";
import { SearchUserDto, UpdateProfileDto } from "../../../domain/dtos/users";
import { GetProfile, UpdateProfile, SearchUsers } from "../../../domain/use-cases/users";
import { PasswordHasher } from "../../../domain/adapters";
import { handleError } from "../../helpers/handle-error";

export class UserController {
    
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    public getProfile = (req: Request, res: Response) => {
        const userId = req.userId;

        new GetProfile(this.userRepository)
            .execute(userId!)
            .then(user => res.json({
                ok: true,
                status: 200,
                message: 'Perfil obtenido correctamente',
                data: user
            }))
            .catch(error => handleError(res, error));
    }

    public updateProfile = (req: Request, res: Response) => {
        const [error, updateProfileDto] = UpdateProfileDto.create({id: req.userId, ...req.body});
        if(error) return handleError(res, error);

        new UpdateProfile(this.userRepository, this.passwordHasher)
            .execute(updateProfileDto!)
            .then(user => res.json({
                ok: true,
                status: 200,
                message: 'Perfil actualizado correctamente',
                data: user
            }))
            .catch(error => handleError(res, error));
    }

    public searchUser = (req: Request, res: Response) => {
        const [error, searchUserDto] = SearchUserDto.create({id: req.userId, ...req.body});
        if(error) return handleError(res, error);

        new SearchUsers(this.userRepository)
            .execute(searchUserDto!)
            .then(users => res.json({
                ok: true,
                status: 200,
                message: 'Usuarios obtenidos correctamente',
                data: users
            }))
            .catch(error => handleError(res, error));
    }

}