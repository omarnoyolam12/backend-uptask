import { isValidObjectId } from "mongoose";
import { UserModel } from "../../../data/mongo/models/user.model";

import { UserDatasource } from "../../../domain/datasources/user.datasource";
import { CreateUserDto, SearchUserDto, UpdateProfileDto } from "../../../domain/dtos/users";
import { UserEntity, UserSummaryEntity, UserCredentialsEntity } from "../../../domain/entities/users";
import { CustomError } from "../../../domain/errors/custom.error";


export class UserMongoDatasourceImpl implements UserDatasource {

    constructor(
    ){}

    async create(dto: CreateUserDto): Promise<UserEntity> {

        const user = await UserModel.create({
            name: dto.name,
            username: dto.username,
            email: dto.email,
            password: dto.password,
        });

        return UserEntity.fromObject(user);
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
    
    async getCredentialsByEmail(email: string): Promise<UserCredentialsEntity | null> {
        const user = await UserModel.findOne({ email }).select('+password').lean();
        if (!user) {
            return null;
        }

        return UserCredentialsEntity.fromObject(user);
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
        if (!isValidObjectId(dto.id)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            dto.id,
            { $set: dto.values },
            { new: true }
        ).lean();

        if (!updatedUser) {
            throw CustomError.notFound("Usuario no encontrado");
        }

        return UserEntity.fromObject(updatedUser);
    }
    
    async updatePassword(id: string, passwordHash: string): Promise<void> {
        if (!isValidObjectId(id)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: { password: passwordHash } }
        ).lean();

        if (!updatedUser) {
            throw CustomError.notFound("Usuario no encontrado");
        }
    }
    
    async markAsConfirmed(id: string): Promise<UserEntity> {
        if (!isValidObjectId(id)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const user = await UserModel.findByIdAndUpdate(
            id,
            { $set: { isConfirmed: true } },
            { new: true }
        ).lean();

        if (!user) {
            throw CustomError.notFound("Usuario no encontrado");
        }

        return UserEntity.fromObject(user);
    }

}