import { z } from 'zod';

const logoutSchema = z.object({
    refreshToken: z
        .string({ error: 'El refresh token es requerido' })
        .trim()
        .min(1, 'El refresh token es requerido'),
});

export class LogoutDto {
    private constructor(
        public readonly refreshToken: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, LogoutDto?] {
        const result = logoutSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { refreshToken } = result.data;
        return [undefined, new LogoutDto(refreshToken)];
    }
}
