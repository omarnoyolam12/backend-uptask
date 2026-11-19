import { Router } from "express";
import { UserMongoDatasourceImpl } from "../../../infrastructure/datasource/mongo/user.datasource.impl"
import { UserController } from "./controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { BcryptPasswordHasher, JoseTokenSigner } from "../../../infrastructure/adapters";
import { envs } from "../../../config/envs";

export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        const token = new JoseTokenSigner({secret: envs.JWT_SECRET});
        const authMiddleware = new AuthMiddleware(token);

        const datasource = new UserMongoDatasourceImpl();
        const passwordHasher = new BcryptPasswordHasher();
        const controller = new UserController(datasource, passwordHasher);

        router.get('/me', authMiddleware.validateJWT, controller.getProfile);
        router.put('/me', authMiddleware.validateJWT, controller.updateProfile);
        router.put('/search', authMiddleware.validateJWT, controller.searchUser);

        return router;
    }
}