import { Request, Response } from "express";

import { UserRepository, RefreshTokenRepository } from "../../../domain/repositories";
import { SearchUserDto, UpdateProfileDto, ChangePasswordDto } from "../../../domain/dtos/users";
import { GetProfile, UpdateProfile, SearchUsers, ChangePassword } from "../../../domain/use-cases/users";
import { PasswordHasher, TokenSigner, RefreshTokenGenerator } from "../../../domain/adapters";
import { handleError } from "../../helpers/handle-error";

interface UserControllerDependencies {
    userRepository: UserRepository;
    refreshTokenRepository: RefreshTokenRepository;
    passwordHasher: PasswordHasher;
    tokenSigner: TokenSigner;
    refreshTokenGenerator: RefreshTokenGenerator;
}

export class UserController {
    
    private readonly userRepository: UserRepository;
    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly passwordHasher: PasswordHasher;
    private readonly tokenSigner: TokenSigner;
    private readonly refreshTokenGenerator: RefreshTokenGenerator;

    constructor(dependencies: UserControllerDependencies) {
        this.userRepository = dependencies.userRepository;
        this.refreshTokenRepository = dependencies.refreshTokenRepository;
        this.passwordHasher = dependencies.passwordHasher;
        this.tokenSigner = dependencies.tokenSigner;
        this.refreshTokenGenerator = dependencies.refreshTokenGenerator;
    }

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
        const [error, searchUserDto] = SearchUserDto.create({ requesterId: req.userId, query: req.params.query });
        if(error) return handleError(res, error);

        new SearchUsers(this.userRepository)
            .execute(searchUserDto!)
            .then(user => res.json({
                ok: true,
                status: 200,
                message: 'Usuarios obtenidos correctamente',
                data: user
            }))
            .catch(error => handleError(res, error));
    }

    public changePassword = (req: Request, res: Response) => {
        const [error, changePasswordDto] = ChangePasswordDto.create({id: req.userId, ...req.body});
        if(error) return handleError(res, error);

        new ChangePassword(
            this.userRepository,
            this.refreshTokenRepository,
            this.passwordHasher,
            this.tokenSigner,
            this.refreshTokenGenerator
        )
            .execute(changePasswordDto!)
            .then(result => res.json({
                ok: true,
                status: 200,
                message: 'Contraseña cambiada correctamente',
                data: result
            }))
            .catch(error => handleError(res, error));
    }
}