import { ConfirmationCodeEntity } from '../entities/auth/confirmation-code.entity';

export abstract class ConfirmationCodeRepository {
    abstract save(userId: string, code: string, expiresAt: Date): Promise<ConfirmationCodeEntity>;
    abstract findByUser(userId: string): Promise<ConfirmationCodeEntity | null>;
    abstract deleteByUser(userId: string): Promise<void>;
}