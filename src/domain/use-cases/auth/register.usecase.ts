import { RegisterDto } from "../../dtos/auth/register.dto";
import { UserRepository } from "../../repositories/user.repository";
import { ConfirmationCodeRepository } from "../../repositories/confirmation.code.repository";
import { UserEntity } from "../../entities/users";

export interface RegisterUseCase {
    execute(registerDto: RegisterDto): Promise<UserEntity>;
}

export class Register implements RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly confirmationCodeRepository: ConfirmationCodeRepository,
    ) {}

    async execute(registerDto: RegisterDto): Promise<UserEntity> {
        const newUser = await this.userRepository.create(registerDto);
        await this.confirmationCodeRepository.save(newUser.id);

        return newUser;
    }
}