import { isValidObjectId } from "mongoose";
import { ConfirmationCodeDatasource } from "../../../domain/datasources/confirmation-code.datasource";
import { ConfirmationCodeModel } from "../../../data/mongo/models/confirmation-code.model";
import { ConfirmationCodeEntity } from "../../../domain/entities/auth/confirmation-code.entity";
import { CustomError } from "../../../domain/errors/custom.error";

export class ConfirmationCodeDatasourceImpl implements ConfirmationCodeDatasource {
    async save(userId: string, code: string, expiresAt: Date): Promise<ConfirmationCodeEntity> {
        if (!isValidObjectId(userId)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        await ConfirmationCodeModel.deleteMany({ user: userId });

        const confirmationCode = await ConfirmationCodeModel.create({
            user: userId,
            code,
            expiresAt,
        });

        return ConfirmationCodeEntity.fromObject(confirmationCode);
    }
    
    async findByUser(userId: string): Promise<ConfirmationCodeEntity | null> {
        if (!isValidObjectId(userId)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        const confirmationCode = await ConfirmationCodeModel.findOne({ user: userId }).lean();
        if (!confirmationCode) {
            return null;
        }

        return ConfirmationCodeEntity.fromObject(confirmationCode);
    }
    
    async deleteByUser(userId: string): Promise<void> {
        if (!isValidObjectId(userId)) {
            throw CustomError.badRequest("ID de usuario no válido");
        }

        await ConfirmationCodeModel.deleteMany({ user: userId });
    }
    
}
