import { z } from 'zod';

const changePasswordSchema = z
    .object({
        id: z
            .string({ error: 'El ID es requerido' })
            .trim()
            .min(1, 'El ID es requerido'),
        currentPassword: z
            .string({ error: 'La contraseña actual es requerida' })
            .min(1, 'La contraseña actual es requerida'),
        newPassword: z
            .string({ error: 'La nueva contraseña es requerida' })
            .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
            .regex(/[A-Z]/, 'La nueva contraseña debe contener al menos una letra mayúscula')
            .regex(/[a-z]/, 'La nueva contraseña debe contener al menos una letra minúscula')
            .regex(/[0-9]/, 'La nueva contraseña debe contener al menos un número')
            .regex(/[^A-Za-z0-9]/, 'La nueva contraseña debe contener al menos un carácter especial'),
    })
    .refine(
        (data) => data.currentPassword !== data.newPassword,
        {
            message: 'La nueva contraseña debe ser diferente a la actual',
            path: ['newPassword'],
        },
    );

export class ChangePasswordDto {
    private constructor(
        public readonly id: string,
        public readonly currentPassword: string,
        public readonly newPassword: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, ChangePasswordDto?] {
        const result = changePasswordSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { id, currentPassword, newPassword } = result.data;
        return [undefined, new ChangePasswordDto(id, currentPassword, newPassword)];
    }
}
