import { Router } from "express";

import { UserMongoDatasourceImpl, RefreshTokenMongoDatasourceImpl } from "../../../infrastructure/datasource/mongo"
import { UserRepositoryImpl, RefreshTokenRepositoryImpl } from "../../../infrastructure/repository";
import { UserController } from "./controller";
import { PasswordHasher, TokenSigner, RefreshTokenGenerator } from "../../../domain/adapters";

export class UserRoutes {
    static routes(
        passwordHasher: PasswordHasher, 
        tokenSigner: TokenSigner,
        refreshTokenGenerator: RefreshTokenGenerator,
    ): Router {
        const router = Router();

        const userDatasource = new UserMongoDatasourceImpl();
        const userRepository = new UserRepositoryImpl(userDatasource);

        const refreshTokenDatasource = new RefreshTokenMongoDatasourceImpl();
        const refreshTokenRepository = new RefreshTokenRepositoryImpl(refreshTokenDatasource);

        
        const controller = new UserController({
            userRepository: userRepository,
            refreshTokenRepository: refreshTokenRepository,
            passwordHasher: passwordHasher,
            tokenSigner: tokenSigner,
            refreshTokenGenerator: refreshTokenGenerator
        });

        router.get('/me', controller.getProfile);
        router.put('/me', controller.updateProfile);
        router.put('/me/password', controller.changePassword)
        router.put('/search/:query', controller.searchUser);

        return router;
    }
}