import { UserRepository, RefreshTokenRepository } from "../../repositories";
import { ChangePasswordDto } from "../../dtos/users";
import { PasswordHasher, TokenSigner, RefreshTokenGenerator } from "../../adapters";
import { CustomError } from "../../errors/custom.error";

export interface ChangePasswordResult {
    accessToken: string;
    refreshToken: string;
}

export interface ChangePasswordUseCase {
    execute(changePasswordDto: ChangePasswordDto): Promise<ChangePasswordResult>;
}

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export class ChangePassword implements ChangePasswordUseCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenSigner: TokenSigner,
        private readonly refreshTokenGenerator: RefreshTokenGenerator,
    ) { }

    async execute(changePasswordDto: ChangePasswordDto): Promise<ChangePasswordResult> {
        const { id, currentPassword, newPassword } = changePasswordDto;

        const credentials = await this.repository.getCredentialsById(id);

        const isValidPassword = await this.passwordHasher.compare(currentPassword, credentials.password);
        if (!isValidPassword) {
            throw CustomError.forbidden('La contraseña actual es incorrecta');
        }

        const passwordHash = await this.passwordHasher.hash(newPassword);

        await this.repository.updatePassword(id, passwordHash);
        await this.refreshTokenRepository.deleteByUser(id);

        const accessToken = await this.tokenSigner.sign({ userId: id });
        const refreshToken = this.refreshTokenGenerator.generate();
        const tokenHash = this.refreshTokenGenerator.hash(refreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

        await this.refreshTokenRepository.save(id, tokenHash, expiresAt);

        return {
            accessToken,
            refreshToken,
        };
    }
}