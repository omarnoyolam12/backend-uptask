import { UserRepository, ConfirmationCodeRepository } from "../../repositories";
import { ConfirmAccountDto } from "../../dtos/auth/confirm-account.dto";
import { UserEntity } from "../../entities/users";
import { CustomError } from "../../errors/custom.error";

export interface ConfirmAccountUseCase {
    execute(confirmAccountDto: ConfirmAccountDto): Promise<UserEntity>;
}

export class ConfirmAccount implements ConfirmAccountUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly confirmationCodeRepository: ConfirmationCodeRepository
    ){}
    
    async execute(confirmAccountDto: ConfirmAccountDto): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(confirmAccountDto.email);
        if (!user) {
            throw CustomError.notFound("Usuario no encontrado");
        }

        if (user.isConfirmed) {
            throw CustomError.badRequest("La cuenta ya está confirmada");
        }

        const confirmationCode = await this.confirmationCodeRepository.findByUser(user.id);
        if (!confirmationCode || confirmationCode.code !== confirmAccountDto.code) {
            throw CustomError.badRequest("Código de confirmación inválido");
        }

        if (confirmationCode.expiresAt <= new Date()) {
            throw CustomError.badRequest("El código de confirmación ha expirado");
        }

        const confirmedUser = await this.userRepository.markAsConfirmed(user.id);
        await this.confirmationCodeRepository.deleteByUser(user.id);

        return confirmedUser;
    }

}