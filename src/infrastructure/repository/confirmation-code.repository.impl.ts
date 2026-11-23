import { ConfirmationCodeDatasource } from '../../domain/datasources/confirmation-code.datasource';
import { ConfirmationCodeEntity } from '../../domain/entities/auth/confirmation-code.entity';
import { ConfirmationCodeRepository } from '../../domain/repositories/confirmation.code.repository';

export class ConfirmationCodeRepositoryImpl implements ConfirmationCodeRepository {
    constructor(private readonly datasource: ConfirmationCodeDatasource) {}

    save(userId: string, code: string, expiresAt: Date): Promise<ConfirmationCodeEntity> {
        return this.datasource.save(userId, code, expiresAt);
    }

    findByUser(userId: string): Promise<ConfirmationCodeEntity | null> {
        return this.datasource.findByUser(userId);
    }

    deleteByUser(userId: string): Promise<void> {
        return this.datasource.deleteByUser(userId);
    }
}
