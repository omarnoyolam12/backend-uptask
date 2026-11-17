import { UserEntity } from "../../entities/users";
import { UserRepository } from "../../repositories/user.repository";

export interface GetProfileUseCase {
    execute(userId: string): Promise<UserEntity>;
}

export class GetProfile implements GetProfileUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(userId: string): Promise<UserEntity> {
        return this.userRepository.getById(userId);
    }
}