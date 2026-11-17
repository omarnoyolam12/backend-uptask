import { z } from 'zod';

export type SearchUserBy = 'email' | 'username';

const searchUserSchema = z.object({
    requesterId: z
        .string({ error: 'El ID del solicitante es requerido' })
        .trim()
        .min(1, 'El ID del solicitante es requerido'),
    query: z
        .string({ error: 'El término de búsqueda es requerido' })
        .trim()
        .toLowerCase()
        .min(1, 'El término de búsqueda es requerido'),
});

export class SearchUserDto {
    private constructor(
        public readonly requesterId: string,
        public readonly query: string,
        public readonly searchBy: SearchUserBy,
    ) {}

    static create(props: Record<string, unknown>): [string?, SearchUserDto?] {
        const result = searchUserSchema.safeParse(props);

        if (!result.success) {
            return [result.error.issues[0]?.message ?? 'Datos inválidos', undefined];
        }

        const { requesterId, query } = result.data;
        const searchBy: SearchUserBy = query.includes('@') ? 'email' : 'username';

        return [undefined, new SearchUserDto(requesterId, query, searchBy)];
    }
}
