import { z } from 'zod';

const registerSchema = z.object({
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
        .max(20, 'El nombre de usuario no puede exceder los 20 caracteres')
        .regex(/^[a-z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
    email: z
        .email('El email no tiene un formato válido')
        .trim()
        .toLowerCase(),
    password: z
        .string({ error: 'La contraseña es requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export class RegisterDto {
    private constructor(
        public readonly name: string,
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, RegisterDto?] {
        const result = registerSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { name, username, email, password } = result.data;
        return [undefined, new RegisterDto(name, username, email, password)];
    }
}
