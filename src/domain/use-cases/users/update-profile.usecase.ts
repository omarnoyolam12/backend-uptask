import { UpdateProfileDto } from "../../dtos/users";
import { UserEntity } from "../../entities/users";
import { UserRepository } from "../../repositories/user.repository";


export interface UpdateProfileUseCase {
    execute(updateProfileDto: UpdateProfileDto): Promise<UserEntity>;
}

export class UpdateProfile implements UpdateProfileUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(updateProfileDto: UpdateProfileDto): Promise<UserEntity> {
        return this.userRepository.update(updateProfileDto);
    }
}