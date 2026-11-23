import { UserRepository, RefreshTokenRepository } from "../../repositories";
import { PasswordHasher, TokenSigner, RefreshTokenGenerator } from "../../adapters";
import { LoginDto } from "../../dtos/auth";
import { UserEntity } from "../../entities/users";
import { CustomError } from "../../errors/custom.error";

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
}

export interface LoginUseCase {
    execute(loginDto: LoginDto): Promise<LoginResult>;
}

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export class Login implements LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenSigner: TokenSigner,
        private readonly refreshTokenGenerator: RefreshTokenGenerator,
    ) {}

    async execute(loginDto: LoginDto): Promise<LoginResult> {
        const credentials = await this.userRepository.getCredentialsByEmail(loginDto.email);
        if (!credentials) {
            throw CustomError.unauthorized("Credenciales incorrectas");
        }

        const isValidPassword = await this.passwordHasher.compare(
            loginDto.password,
            credentials.password,
        );
        if (!isValidPassword) {
            throw CustomError.unauthorized("Credenciales incorrectas");
        }

        if (!credentials.isConfirmed) {
            throw CustomError.forbidden("La cuenta no está confirmada");
        }

        const user = await this.userRepository.getById(credentials.id);
        const accessToken = await this.tokenSigner.sign({ userId: user.id });

        const refreshToken = this.refreshTokenGenerator.generate();
        const tokenHash = this.refreshTokenGenerator.hash(refreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

        await this.refreshTokenRepository.save(user.id, tokenHash, expiresAt);

        return {
            accessToken,
            refreshToken,
            user,
        };
    }
}
