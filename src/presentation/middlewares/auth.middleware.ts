import { NextFunction, Request, Response } from 'express';
import { TokenSigner } from '../../domain/adapters';
import { handleError } from '../helpers/handle-error';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export class AuthMiddleware {

    constructor(
        private readonly tokenSigner: TokenSigner,
    ) {}

    public validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.header('Authorization');
        if (!authorization) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const parts = authorization.trim().split(/\s+/);
        if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
            return res.status(401).json({ error: 'Formato de autorización inválido' });
        }

        const token = parts[1];

        try {
            const payload = await this.tokenSigner.verify(token);
            if (!payload?.userId) {
                return res.status(401).json({ error: 'Token inválido o expirado' });
            }

            req.userId = payload.userId;
            next();
        } catch (error) {
            return handleError(res, error);
        }
    };
}
