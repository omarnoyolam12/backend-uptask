import { z } from 'zod';

const loginSchema = z.object({
    email: z
        .email('El email no tiene un formato válido')
        .trim()
        .toLowerCase(),
    password: z
        .string({ error: 'La contraseña es requerida' })
        .min(1, 'La contraseña es requerida'),
});

export class LoginDto {
    private constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, LoginDto?] {
        const result = loginSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { email, password } = result.data;
        return [undefined, new LoginDto(email, password)];
    }
}
