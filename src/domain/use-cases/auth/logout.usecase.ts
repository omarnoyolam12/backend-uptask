import { RefreshTokenRepository } from "../../repositories";
import { RefreshTokenGenerator } from "../../adapters";
import { LogoutDto } from "../../dtos/auth/logout.dto";

export interface LogoutUseCase {
    execute(logoutDto: LogoutDto): Promise<void>;
}

export class Logout implements LogoutUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly refreshTokenGenerator: RefreshTokenGenerator,
    ) {}

    async execute(logoutDto: LogoutDto): Promise<void> {
        const tokenHash = this.refreshTokenGenerator.hash(logoutDto.refreshToken);
        await this.refreshTokenRepository.deleteByHash(tokenHash);
    }
}
