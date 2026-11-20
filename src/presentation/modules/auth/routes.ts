import { Router } from "express";

import { UserMongoDatasourceImpl, ConfirmationCodeMongoDatasourceImpl, RefreshTokenMongoDatasourceImpl } from "../../../infrastructure/datasource/mongo";
import { UserRepositoryImpl, ConfirmationCodeRepositoryImpl, RefreshTokenRepositoryImpl } from "../../../infrastructure/repository";
import { PasswordHasher, TokenSigner, EmailSender, RefreshTokenGenerator } from "../../../domain/adapters";
import { AuthController } from "./controller";

export class AuthRoutes {
    static routes(
        passwordHasher: PasswordHasher, 
        tokenSigner: TokenSigner,
        emailSender: EmailSender,
        refreshTokenGenerator: RefreshTokenGenerator,
    ): Router {
        const router = Router();

        const userDatasource = new UserMongoDatasourceImpl();
        const userRepository = new UserRepositoryImpl(userDatasource);

        const confirmationCodeDatasource = new ConfirmationCodeMongoDatasourceImpl();
        const confirmationCodeRepository = new ConfirmationCodeRepositoryImpl(confirmationCodeDatasource);
        
        const refreshTokenDatasource = new RefreshTokenMongoDatasourceImpl();
        const refreshTokenRepository = new RefreshTokenRepositoryImpl(refreshTokenDatasource);

        const authController = new AuthController({
            userRepository,
            confirmationCodeRepository,
            refreshTokenRepository,
            passwordHasher,
            tokenSigner,
            refreshTokenGenerator,
            emailSender
        });

        router.post('/register', authController.register);
        router.post('/confirm-accout', authController.confirmAccount);
        router.post('/resend-confimation', authController.resendConfirmation);
        router.post('/login', authController.login);
        router.post('/refresh', authController.refreshSession);
        router.post('/logout', authController.logout);

        return router;
    }
}