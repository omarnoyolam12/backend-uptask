export interface AccessTokenPayload {
    userId: string;
}

export abstract class TokenSigner {
    abstract sign(payload: AccessTokenPayload): Promise<string>;
    abstract verify(token: string): Promise<AccessTokenPayload | null>;
}

