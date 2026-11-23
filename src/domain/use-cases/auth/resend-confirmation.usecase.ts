import { randomInt } from 'crypto';
import { UserRepository, ConfirmationCodeRepository } from '../../repositories';
import { EmailSender } from '../../adapters';
import { ResendConfirmationDto } from '../../dtos/auth/resend-confirmation.dto';

export interface ResendConfirmationUseCase {
    execute(resendConfirmationDto: ResendConfirmationDto): Promise<void>;
}

export class ResendConfirmation implements ResendConfirmationUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly confirmationCodeRepository: ConfirmationCodeRepository,
        private readonly emailSender: EmailSender,
    ) {}

    async execute(resendConfirmationDto: ResendConfirmationDto): Promise<void> {
        const user = await this.userRepository.findByEmail(resendConfirmationDto.email);

        if (!user || user.isConfirmed) {
            return;
        }

        const code = randomInt(100000, 1000000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await this.confirmationCodeRepository.save(user.id, code, expiresAt);
        await this.emailSender.sendResendConfirmationEmail(user.email, user.name, code);
    }
}
