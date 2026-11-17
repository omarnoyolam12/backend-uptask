import { z } from 'zod';

export interface UpdateProfileValues {
    name?: string;
    username?: string;
    email?: string;
}

const updateProfileValuesSchema = z.object({
    name: z
        .string({ error: 'El nombre debe ser un texto válido' })
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(80, 'El nombre no puede exceder los 80 caracteres')
        .optional(),
    username: z
        .string({ error: 'El nombre de usuario debe ser un texto válido' })
        .trim()
        .toLowerCase()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(30, 'El nombre de usuario no puede exceder los 30 caracteres')
        .regex(/^[a-z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos')
        .optional(),
    email: z
        .email('El email no tiene un formato válido')
        .trim()
        .toLowerCase()
        .optional(),
}).refine(
    (values) =>
        values.name !== undefined ||
        values.username !== undefined ||
        values.email !== undefined,
    { message: 'Debes enviar al menos un campo para actualizar' },
);

const updateProfileSchema = z.object({
    id: z
        .string({ error: 'El ID es requerido' })
        .trim()
        .min(1, 'El ID es requerido'),
    values: updateProfileValuesSchema,
    currentPassword: z
        .string({ error: 'La contraseña actual debe ser un texto válido' })
        .min(1, 'La contraseña actual no puede estar vacía')
        .optional(),
}).refine(
    (data) => data.values.email === undefined || Boolean(data.currentPassword),
    {
        message: 'La contraseña actual es requerida para cambiar el email',
        path: ['currentPassword'],
    },
);

export class UpdateProfileDto {
    private constructor(
        public readonly id: string,
        public readonly values: UpdateProfileValues,
        public readonly currentPassword?: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, UpdateProfileDto?] {
        const result = updateProfileSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { id, values, currentPassword } = result.data;
        return [undefined, new UpdateProfileDto(id, values, currentPassword)];
    }
}

