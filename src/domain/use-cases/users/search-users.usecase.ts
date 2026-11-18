import { SearchUserDto } from "../../dtos/users";
import { UserSummaryEntity } from "../../entities/users";
import { UserRepository } from "../../repositories/user.repository";


export interface SearchUsersUseCase {
    execute(searchUserDto: SearchUserDto): Promise<UserSummaryEntity>;
}

export class SearchUsers implements SearchUsersUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(searchUserDto: SearchUserDto): Promise<UserSummaryEntity> {
        return this.userRepository.findExact(searchUserDto);
    }
}