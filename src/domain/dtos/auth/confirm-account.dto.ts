import { z } from 'zod';

const confirmAccountSchema = z.object({
    email: z
        .email('El email no tiene un formato válido')
        .trim()
        .toLowerCase(),
    code: z
        .string({ error: 'El código es requerido' })
        .trim()
        .regex(/^\d{6}$/, 'El código debe tener exactamente 6 dígitos'),
});

export class ConfirmAccountDto {
    private constructor(
        public readonly email: string,
        public readonly code: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, ConfirmAccountDto?] {
        const result = confirmAccountSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { email, code } = result.data;
        return [undefined, new ConfirmAccountDto(email, code)];
    }
}
