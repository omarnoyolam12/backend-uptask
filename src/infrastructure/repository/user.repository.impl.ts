import { UserRepository } from "../../domain/repositories/user.repository";
import { UserCredentialsEntity, UserEntity, UserSummaryEntity } from "../../domain/entities/users";
import { CreateUserDto, UpdateProfileDto, SearchUserDto } from "../../domain/dtos/users";
import { UserDatasource } from "../../domain/datasources/user.datasource";

export class UserRepositoryImpl implements UserRepository {

    constructor(private readonly datasource: UserDatasource) {}

    create(dto: CreateUserDto): Promise<UserEntity> {
        return this.datasource.create(dto);
    }
    getById(id: string): Promise<UserEntity> {
        return this.datasource.getById(id);
    }
    findByEmail(email: string): Promise<UserEntity | null> {
        return this.datasource.findByEmail(email);
    }
    findByUsername(username: string): Promise<UserEntity | null> {
        return this.datasource.findByUsername(username);
    }
    findExact(dto: SearchUserDto): Promise<UserSummaryEntity> {
        return this.datasource.findExact(dto);
    }
    getSummariesByIds(ids: string[]): Promise<UserSummaryEntity[]> {
        return this.datasource.getSummariesByIds(ids);
    }
    getCredentialsByEmail(email: string): Promise<UserCredentialsEntity | null> {
        return this.datasource.getCredentialsByEmail(email);
    }
    getCredentialsById(id: string): Promise<UserCredentialsEntity> {
        return this.datasource.getCredentialsById(id);
    }
    update(dto: UpdateProfileDto): Promise<UserEntity> {
        return this.datasource.update(dto);
    }
    updatePassword(id: string, passwordHash: string): Promise<void> {
        return this.datasource.updatePassword(id, passwordHash);
    }
    markAsConfirmed(id: string): Promise<UserEntity> {
        return this.datasource.markAsConfirmed(id);
    }
    
}