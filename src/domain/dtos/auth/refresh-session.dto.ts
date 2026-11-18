import { z } from 'zod';

const refreshSessionSchema = z.object({
    refreshToken: z
        .string({ error: 'El refresh token es requerido' })
        .trim()
        .min(1, 'El refresh token es requerido'),
});

export class RefreshSessionDto {
    private constructor(
        public readonly refreshToken: string,
    ) {}

    static create(props: Record<string, unknown>): [string?, RefreshSessionDto?] {
        const result = refreshSessionSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { refreshToken } = result.data;
        return [undefined, new RefreshSessionDto(refreshToken)];
    }
}
