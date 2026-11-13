import { compare, hash } from 'bcryptjs';
import { PasswordHasher } from '../../domain/adapters/password-hasher.adapter';

export class BcryptPasswordHasher implements PasswordHasher {

    constructor(private readonly saltRounds: number = 12) {}

    async hash(plain: string): Promise<string> {
        return hash(plain, this.saltRounds);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return compare(plain, hashed);
    }
}

