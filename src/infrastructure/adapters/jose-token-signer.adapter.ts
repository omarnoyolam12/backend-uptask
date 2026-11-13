import { jwtVerify, SignJWT } from 'jose';
import { AccessTokenPayload, TokenSigner } from '../../domain/adapters/token-signer.adapter';

export interface JoseTokenSignerOptions {
    secret: string;
    expiresIn?: string;
}

export class JoseTokenSigner implements TokenSigner {
    private readonly secretKey: Uint8Array;
    private readonly expiresIn: string;

    constructor({ secret, expiresIn = '15m' }: JoseTokenSignerOptions) {
        this.secretKey = new TextEncoder().encode(secret);
        this.expiresIn = expiresIn;
    }

    async sign(payload: AccessTokenPayload): Promise<string> {
        return new SignJWT({ userId: payload.userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(this.expiresIn)
            .sign(this.secretKey);
    }

    async verify(token: string): Promise<AccessTokenPayload | null> {
        try {
            const { payload } = await jwtVerify(token, this.secretKey);
            if (typeof payload.userId !== 'string') return null;
            return { userId: payload.userId };
        } catch {
            return null;
        }
    }
}

