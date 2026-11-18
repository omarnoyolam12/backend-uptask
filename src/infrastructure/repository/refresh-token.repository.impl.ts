import { RefreshTokenDatasource } from '../../domain/datasources/refresh-token.datasource';
import { RefreshTokenEntity } from '../../domain/entities/auth/refresh-token.entity';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
    constructor(private readonly datasource: RefreshTokenDatasource) {}

    save(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshTokenEntity> {
        return this.datasource.save(userId, tokenHash, expiresAt);
    }

    findByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
        return this.datasource.findByHash(tokenHash);
    }

    deleteByHash(tokenHash: string): Promise<void> {
        return this.datasource.deleteByHash(tokenHash);
    }

    deleteByUser(userId: string): Promise<void> {
        return this.datasource.deleteByUser(userId);
    }
}
