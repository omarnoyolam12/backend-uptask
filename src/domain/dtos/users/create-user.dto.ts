import { z } from 'zod';

const createUserSchema = z.object({
    name: z
        .string({ error: 'El nombre es requerido' })
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(80, 'El nombre no puede exceder los 80 caracteres'),
    username: z
        .string({ error: 'El nombre de usuario es requerido' })
        .trim()
        .toLowerCase()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(30, 'El nombre de usuario no puede exceder los 30 caracteres')
        .regex(/^[a-z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
    password: z
        .string({ error: 'La contraseña es requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
    email: z
        .email('El email no tiene un formato válido')
        .trim()
        .toLowerCase(),
});

export class CreateUserDto {
    private constructor(
        public readonly name: string,
        public readonly username: string,
        public readonly password: string,
        public readonly email: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, CreateUserDto?] {
        const result = createUserSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { name, username, password, email } = result.data;
        return [undefined, new CreateUserDto(name, username, password, email)];
    }
}
