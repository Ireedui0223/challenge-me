import {
  PaginationSchema,
  TPagination,
  TPaginationResponse
} from '../types/common.type';

export const pagination = (doc: TPagination): TPaginationResponse => {
  const { limit, page } = PaginationSchema.parse(doc);
  if (page < 1 || limit < 1) throw new Error('Утга хоосон байна');
  const _page = Number(page);
  const _limit = Number(limit);
  return { limit: _limit || 10, offset: (_page - 1) * _limit || 0 };
};
