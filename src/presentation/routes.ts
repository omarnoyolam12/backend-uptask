import { Router } from "express";
import { JoseTokenSigner, BcryptPasswordHasher, ResendEmailSender, CryptoRefreshTokenGenerator} from "../infrastructure/adapters";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { UserRoutes } from "./modules/user/routes";
import { AuthRoutes } from "./modules/auth/routes";
import { envs } from "../config/envs";

export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        // *Adaptadores-----------------------------------------  
        const emailSender = new ResendEmailSender({
            apiKey: envs.EMAIL_API_KEY,
            from: 'UpTask <onboarding@resend.dev>',
            ...(envs.NODE_ENV !== 'production' ? { devRedirectTo: 'omar.noyolam12@gmail.com' } : {}),
        });
        const passwordHasher = new BcryptPasswordHasher();
        const tokenSigner = new JoseTokenSigner({ secret: envs.JWT_SECRET });
        const refreshTokenGenerator = new CryptoRefreshTokenGenerator();

        // *Middlewares-----------------------------------------
        const authMiddleware = new AuthMiddleware(tokenSigner);

        // *Rutas----------------------------------------------
        router.use('/auth', AuthRoutes.routes(passwordHasher, tokenSigner, emailSender, refreshTokenGenerator));
        
        router.use(authMiddleware.validateJWT);
        router.use('/users', UserRoutes.routes(passwordHasher, tokenSigner, refreshTokenGenerator));

        return router;
    }
}