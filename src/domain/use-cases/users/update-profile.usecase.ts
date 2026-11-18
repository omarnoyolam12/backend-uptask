import { UserRepository } from "../../repositories/user.repository";
import { PasswordHasher } from "../../adapters/password-hasher.adapter";
import { UpdateProfileDto } from "../../dtos/users";
import { UserEntity } from "../../entities/users";
import { CustomError } from "../../errors/custom.error";


export interface UpdateProfileUseCase {
    execute(updateProfileDto: UpdateProfileDto): Promise<UserEntity>;
}

export class UpdateProfile implements UpdateProfileUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(updateProfileDto: UpdateProfileDto): Promise<UserEntity> {
        const { id, values, currentPassword } = updateProfileDto;

        if (values.email) {
            const credentials = await this.userRepository.getCredentialsById(id);
            const isValidPassword = await this.passwordHasher.compare(currentPassword!, credentials.password);

            if (!isValidPassword) {
                throw CustomError.unauthorized('Credenciales inválidas');
            }

            const existingEmail = await this.userRepository.findByEmail(values.email);
            if (existingEmail && existingEmail.id !== id) {
                throw CustomError.badRequest('Email ya registrado');
            }
        }

        if (values.username) {
            const existingUsername = await this.userRepository.findByUsername(values.username);
            if (existingUsername && existingUsername.id !== id) {
                throw CustomError.badRequest('Nombre de usuario ya registrado');
            }
        }

        return this.userRepository.update(updateProfileDto);
    }
}