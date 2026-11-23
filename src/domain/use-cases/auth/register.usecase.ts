import { randomInt } from "crypto";
import { UserRepository, ConfirmationCodeRepository } from "../../repositories";
import { PasswordHasher, EmailSender } from "../../adapters";
import { RegisterDto } from "../../dtos/auth/register.dto";
import { UserEntity } from "../../entities/users";
import { CustomError } from "../../errors/custom.error";

export interface RegisterUseCase {
    execute(registerDto: RegisterDto): Promise<UserEntity>;
}

export class Register implements RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly confirmationCodeRepository: ConfirmationCodeRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly emailSender: EmailSender,
    ) {}

    async execute(registerDto: RegisterDto): Promise<UserEntity> {
        const existUser = await this.userRepository.findByEmail(registerDto.email);
        if (existUser) {
            throw CustomError.badRequest("Usuario ya existe");
        }

        const userNameExist = await this.userRepository.findByUsername(registerDto.username);
        if (userNameExist) {
            throw CustomError.badRequest("Nombre de usuario ya existe");
        }

        const passwordHash = await this.passwordHasher.hash(registerDto.password);
        const newUser = await this.userRepository.create({...registerDto, password: passwordHash});

        const code = randomInt(100000, 1000000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.confirmationCodeRepository.save(newUser.id, code, expiresAt);
        await this.emailSender.sendConfirmationEmail(newUser.email, newUser.name, code);

        return newUser;
    }
}