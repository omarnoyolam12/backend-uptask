import { CreateUserDto, UpdateProfileDto, SearchUserDto } from '../dtos/users';
import { UserCredentialsEntity, UserEntity, UserSummaryEntity } from '../entities/users';

export abstract class UserDatasource {
    abstract create(dto: CreateUserDto): Promise<UserEntity>;
    abstract getById(id: string): Promise<UserEntity>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findByUsername(username: string): Promise<UserEntity | null>;
    abstract findExact(dto: SearchUserDto): Promise<UserSummaryEntity>;
    abstract getSummariesByIds(ids: string[]): Promise<UserSummaryEntity[]>;
    abstract getCredentialsByEmail(email: string): Promise<UserCredentialsEntity | null>;
    abstract getCredentialsById(id: string): Promise<UserCredentialsEntity>;
    abstract update(dto: UpdateProfileDto): Promise<UserEntity>;
    abstract updatePassword(id: string, passwordHash: string): Promise<void>;
    abstract markAsConfirmed(id: string): Promise<UserEntity>;
}
