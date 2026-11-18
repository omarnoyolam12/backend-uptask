import { RefreshTokenEntity } from '../entities/auth/refresh-token.entity';

export abstract class RefreshTokenRepository {
    abstract save(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshTokenEntity>;
    abstract findByHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
    abstract deleteByHash(tokenHash: string): Promise<void>;
    abstract deleteByUser(userId: string): Promise<void>;
}
