import { isValidObjectId } from "mongoose";
import { RefreshTokenDatasource } from "../../../domain/datasources/refresh-token.datasource";
import { RefreshTokenModel } from "../../../data/mongo/models/refresh-token.model";
import { RefreshTokenEntity } from "../../../domain/entities/auth/refresh-token.entity";
import { CustomError } from "../../../domain/errors/custom.error";

export class RefreshTokenMongoDatasourceImpl implements RefreshTokenDatasource {
    async save(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshTokenEntity> {
        if (!isValidObjectId(userId)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const refreshToken = await RefreshTokenModel.create({
            user: userId,
            tokenHash,
            expiresAt,
        });

        return RefreshTokenEntity.fromObject(refreshToken);
    }

    async findByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
        const refreshToken = await RefreshTokenModel.findOne({ tokenHash }).lean();
        if (!refreshToken) {
            return null;
        }

        return RefreshTokenEntity.fromObject(refreshToken);
    }

    async deleteByHash(tokenHash: string): Promise<void> {
        await RefreshTokenModel.deleteOne({ tokenHash });
    }

    async deleteByUser(userId: string): Promise<void> {
        if (!isValidObjectId(userId)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        await RefreshTokenModel.deleteMany({ user: userId });
    }
}
