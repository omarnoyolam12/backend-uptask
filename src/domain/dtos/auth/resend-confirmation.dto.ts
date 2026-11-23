import { z } from 'zod';

const resendConfirmationSchema = z.object({
    email: z
        .email('El email no tiene un formato válido')
        .trim()
        .toLowerCase(),
});

export class ResendConfirmationDto {
    private constructor(
        public readonly email: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, ResendConfirmationDto?] {
        const result = resendConfirmationSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { email } = result.data;
        return [undefined, new ResendConfirmationDto(email)];
    }
}
