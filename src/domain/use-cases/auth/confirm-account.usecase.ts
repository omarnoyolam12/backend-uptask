import { ConfirmAccountDto } from "../../dtos/auth/confirm-account.dto";
import { UserRepository } from "../../repositories/user.repository";
import { ConfirmationCodeRepository } from "../../repositories/confirmation.code.repository";
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
        
        if(!user){
            throw CustomError.badRequest("Usuario no encontrado");
        }

        await this.confirmationCodeRepository.findByUser(user.id);

        return user;
        
    }

}