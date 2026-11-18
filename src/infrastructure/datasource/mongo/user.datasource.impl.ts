import { isValidObjectId } from "mongoose";
import { UserModel } from "../../../data/mongo/models/user.model";
import { PasswordHasher } from "../../../domain/adapters/password-hasher.adapter";

import { UserDatasource } from "../../../domain/datasources/user.datasource";
import { CreateUserDto, SearchUserDto, UpdateProfileDto } from "../../../domain/dtos/users";
import { UserEntity, UserSummaryEntity, UserCredentialsEntity } from "../../../domain/entities/users";
import { CustomError } from "../../../domain/errors/custom.error";


export class UserMongoDatasourceImpl implements UserDatasource {

    constructor(
        private readonly passwordHasher: PasswordHasher,
    ){}

    async create(dto: CreateUserDto): Promise<UserEntity> {
        const emailExists = await this.findByEmail(dto.email);
        if (emailExists) {
            throw CustomError.badRequest("Email ya registrado");
        }

        const usernameExists = await this.findByUsername(dto.username);
        if (usernameExists) {
            throw CustomError.badRequest("Nombre de usuario ya registrado");
        }

        const hashedPassword = await this.passwordHasher.hash(dto.password);

        const user = await UserModel.create({
            name: dto.name,
            username: dto.username,
            email: dto.email,
            password: hashedPassword,
        });

        return UserEntity.fromObject(user.toObject());
    }
    
    async getById(id: string): Promise<UserEntity> {
        if (!isValidObjectId(id)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const user = await UserModel.findById(id).lean();
        if (!user) {
            throw CustomError.notFound("Usuario no encontrado");
        }

        return UserEntity.fromObject(user);
    }
    
    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) {
            return null;
        }

        return UserEntity.fromObject(user);
    }
    
    async findByUsername(username: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ username }).lean();
        if (!user) {
            return null;
        }

        return UserEntity.fromObject(user);
    }
    
    async findExact(dto: SearchUserDto): Promise<UserSummaryEntity> {
        const user = await UserModel.findOne({
            [dto.searchBy]: dto.query,
            _id: { $ne: dto.requesterId },
        }).lean();

        if (!user) {
            throw CustomError.notFound("Usuario no encontrado");
        }

        return UserSummaryEntity.fromObject(user);
    }
    
    getSummariesByIds(ids: string[]): Promise<UserSummaryEntity[]> {
        throw new Error("Method not implemented.");
    }
    
    getCredentialsByEmail(email: string): Promise<UserCredentialsEntity | null> {
        throw new Error("Method not implemented.");
    }
    
    async getCredentialsById(id: string): Promise<UserCredentialsEntity> {
        if (!isValidObjectId(id)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const user = await UserModel.findById(id).select('+password').lean();
        if (!user) {
            throw CustomError.notFound("Usuario no encontrado");
        }

        return UserCredentialsEntity.fromObject(user);
    }
    
    async update(dto: UpdateProfileDto): Promise<UserEntity> {
        if(dto.values.email) {
            const credentials = await this.getCredentialsById(dto.id);
            const valid = await this.passwordHasher.compare(dto.currentPassword!, credentials.password);
            
            if(!valid) {
                throw CustomError.unauthorized("Credenciales inválidas");
            }

            const found = await this.findByEmail(dto.values.email);
            if(found) {
                throw CustomError.badRequest("Email ya registrado");
            }
        }

        if(dto.values.username) {
            const found = await this.findByUsername(dto.values.username);
            if(found) {
                throw CustomError.badRequest("Nombre de usuario ya registrado");
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            dto.id,
            { $set: dto.values },
            { new: true }
        ).lean();

        return UserEntity.fromObject(updatedUser!);
    }
    
    updatePassword(id: string, passwordHash: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    markAsConfirmed(id: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

}