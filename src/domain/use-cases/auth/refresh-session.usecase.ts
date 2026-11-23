import { UserRepository, RefreshTokenRepository } from "../../repositories";
import { RefreshTokenGenerator, TokenSigner } from "../../adapters";
import { RefreshSessionDto } from "../../dtos/auth/refresh-session.dto";
import { UserEntity } from "../../entities/users";
import { CustomError } from "../../errors/custom.error";

export interface RefreshSessionResult {
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
}

export interface RefreshSessionUseCase {
    execute(refreshSessionDto: RefreshSessionDto): Promise<RefreshSessionResult>;
}

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export class RefreshSession implements RefreshSessionUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly tokenSigner: TokenSigner,
        private readonly refreshTokenGenerator: RefreshTokenGenerator,
    ) {}

    async execute(refreshSessionDto: RefreshSessionDto): Promise<RefreshSessionResult> {
        const tokenHash = this.refreshTokenGenerator.hash(refreshSessionDto.refreshToken);
        const storedToken = await this.refreshTokenRepository.findByHash(tokenHash);

        if (!storedToken) {
            throw CustomError.unauthorized("Refresh token inválido");
        }

        if (storedToken.expiresAt <= new Date()) {
            await this.refreshTokenRepository.deleteByHash(tokenHash);
            throw CustomError.unauthorized("Refresh token expirado");
        }

        let user: UserEntity;
        try {
            user = await this.userRepository.getById(storedToken.userId);
        } catch (error) {
            if (error instanceof CustomError && error.statusCode === 404) {
                await this.refreshTokenRepository.deleteByHash(tokenHash);
                throw CustomError.unauthorized("Sesión inválida");
            }
            throw error;
        }

        if (!user.isConfirmed) {
            await this.refreshTokenRepository.deleteByHash(tokenHash);
            throw CustomError.forbidden("La cuenta no está confirmada");
        }

        const accessToken = await this.tokenSigner.sign({ userId: user.id });

        await this.refreshTokenRepository.deleteByHash(tokenHash);

        const newRefreshToken = this.refreshTokenGenerator.generate();
        const newTokenHash = this.refreshTokenGenerator.hash(newRefreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

        await this.refreshTokenRepository.save(user.id, newTokenHash, expiresAt);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user,
        };
    }
}
