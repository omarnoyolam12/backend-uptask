import { createHash, randomBytes } from 'node:crypto';
import { RefreshTokenGenerator } from '../../domain/adapters/refresh-token-generator.adapter';

export class CryptoRefreshTokenGenerator implements RefreshTokenGenerator {

    constructor(private readonly byteLength: number = 48) {}

    generate(): string {
        return randomBytes(this.byteLength).toString('base64url');
    }

    hash(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }
}

