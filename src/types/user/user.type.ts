import { z } from 'zod';
import { ROLE, ROLE_FILTER } from '../role.type';
import { PaginationSchema } from '../common.type';
import { Op } from 'sequelize';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum([ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.UNAUTH, ROLE.USER]),
  phoneNumber: z.string(),
});

export type TUser = z.infer<typeof UserSchema>;

export const UserSearchSchema = z
  .object({
    email: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    role: z
      .enum([
        ROLE_FILTER.ADMIN,
        ROLE_FILTER.SUPER_ADMIN,
        ROLE_FILTER.UNAUTH,
        ROLE_FILTER.USER,
        ROLE_FILTER.ALL
      ])
      .nullable()
      .optional(),
    searchParam: z.string().nullable().optional()
  })
  .extend({
    contextRole: z.nativeEnum(ROLE).optional()
  })
  .merge(PaginationSchema)
  .transform((doc) => {
    const { email, phoneNumber, role, searchParam, contextRole, limit, page } =
      doc;

    let where: Record<string, unknown> = { role: ROLE.USER };

    if (searchParam) {
      where = {
        [Op.or]: [
          { email: { [Op.like]: `%${searchParam}%` } },
          { phoneNumber: { [Op.like]: `%${searchParam}%` } }
        ]
      };
    }
    if (email) where.email = email;
    if (phoneNumber) where.phoneNumber = phoneNumber;

    if (role) {
      if (
        role === ROLE_FILTER.SUPER_ADMIN &&
        contextRole !== ROLE.SUPER_ADMIN
      ) {
        throw new Error('Only super admin can see super admin');
      } else {
        where.role = role;
      }

      if (role === ROLE_FILTER.ALL) {
        where.role = { [Op.not]: ROLE.SUPER_ADMIN };
      }
    }

    return { where, limit, page };
  });

export type TUserSearch = z.infer<typeof UserSearchSchema>;

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type TUserLogin = z.infer<typeof UserLoginSchema>;

export type TUserLoginResponse = {
  user: TUser;
  token: string;
};

export const UserUpdateSchema = UserSchema.partial().extend({
  id: z.string()
});

export type TUserUpdate = z.infer<typeof UserUpdateSchema>;

export const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string(),
  role: z.enum([ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.USER])
});
export type TUserCreate = z.infer<typeof UserCreateSchema>;
