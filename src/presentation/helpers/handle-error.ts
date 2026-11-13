import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { CustomError } from '../../domain/errors/custom.error';

export const handleError = (res: Response, error: unknown) => {
    // 1. Errores de dominio
    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
    }

    // 2. ID con formato inválido
    if (error instanceof MongooseError.CastError) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    // 3. Índice único violado (carrera entre la validación y el insert)
    if ((error as any)?.code === 11000) {
        return res.status(409).json({ error: 'Resource already exists' });
    }

    // 4. Todo lo demás
    console.error(error);
    return res.status(500).json({ error: 'Internal server error - check logs' });
};