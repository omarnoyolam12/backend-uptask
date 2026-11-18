import { ConfirmationCodeEntity } from '../entities/auth/confirmation-code.entity';

export abstract class ConfirmationCodeDatasource {
    abstract save(userId: string): Promise<ConfirmationCodeEntity>;
    abstract findByUser(userId: string): Promise<ConfirmationCodeEntity | null>;
    abstract deleteByUser(userId: string): Promise<void>;
}
