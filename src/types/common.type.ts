import { z } from 'zod';
import { ROLE } from './role.type';

export type TJwtTokenObject = {
  role: ROLE;
  id: string | null;
};

export type TContext = {
  id: string;
  role: ROLE;
};

export type TGenericPagination<T> = {
  rows: Array<T>;
  count: number;
};

export const PaginationSchema = z.object({
  limit: z
    .number()
    .nullable()
    .transform((val) => (val === null ? 10 : val))
    .default(10),
  page: z
    .number()
    .nullable()
    .transform((val) => (val === null ? 1 : val))
    .default(1)
});

export type TPagination = z.infer<typeof PaginationSchema>;

export const PaginationResponseSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0)
});

export type TPaginationResponse = z.infer<typeof PaginationResponseSchema>;
