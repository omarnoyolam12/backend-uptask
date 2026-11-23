import { UserRepository } from "../../repositories";
import { UserEntity } from "../../entities/users";

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