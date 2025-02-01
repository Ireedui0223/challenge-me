import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sha256 from 'sha256';

import { Model } from 'sequelize';
import { ROLE } from '../../types/role.type';
import config from '../../config';
import {
  TContext,
  TGenericPagination,
  TJwtTokenObject
} from '../../types/common.type';
import { UserModel } from '../../models/user/user.model';
import {
  TUser,
  TUserCreate,
  TUserLogin,
  TUserLoginResponse,
  TUserSearch,
  UserCreateSchema,
  UserLoginSchema,
  UserSearchSchema,
} from '../../types/user/user.type';
import { pagination } from '../../utils';

const { JWT_TOKEN_SALT } = config;
export class UserController {
  static async findIdCheck(id: string): Promise<TUser & Model> {
    const existedUser = await UserModel.findByPk(id);
    if (!existedUser) {
      throw new Error('User not found');
    }
    return existedUser;
  }

  static async _matchPassword(password, adminPassword): Promise<void> {
    const match = await bcrypt.compare(sha256(password), adminPassword);
    if (!match) throw new Error('Password is incorrect');
  }

  static async _verifyJwt(token: string): Promise<TJwtTokenObject> {
    return jwt.verify(token, JWT_TOKEN_SALT) as TJwtTokenObject;
  }

  static async getTokenInfo(token: string): Promise<TJwtTokenObject> {
    if (!token) return { role: ROLE.UNAUTH, id: null };
    const { id } = await this._verifyJwt(token);
    if (!id) {
      throw new Error('User ID not found');
    }
    const admin = await this.findIdCheck(id);

    return {
      id,
      role: admin.role || ROLE.UNAUTH
    };
  }

  static async generateJwt(doc: { id: string; role: ROLE }): Promise<string> {
    const { role, id } = doc;
    const jwtParam: Record<string, string> = {};

    jwtParam.id = id;
    jwtParam.role = role;

    const jwtToken = jwt.sign(jwtParam, JWT_TOKEN_SALT);
    return jwtToken;
  }

  static async seedAdmin(): Promise<string> {
    await UserModel.create({
      email: 'admin@itours.mn',
      password: 'Admin@123',
      phoneNumber: '99119911',
      role: ROLE.SUPER_ADMIN
    });
    return 'Амжилттай бүртгэгдлээ';
  }

  static async getCurrentUser(context: TContext) {
    const { id } = context;
    return await this.findIdCheck(id);
  }

  static async getAllUser(
    doc: TUserSearch,
    context: TContext
  ): Promise<TGenericPagination<TUser>> {
    const { where } = UserSearchSchema.parse({
      ...doc,
      contextRole: context.role
    });

    return await UserModel.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      ...pagination(doc)
    });
  }

  static async getUser(doc: { id: string }): Promise<TUser> {
    const { id } = doc;
    return await this.findIdCheck(id);
  }

  static async login(doc: TUserLogin): Promise<TUserLoginResponse> {
    const { email, password } = UserLoginSchema.parse(doc);
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    await this._matchPassword(password, user.password);
    const { id, role } = user;
    const token = await this.generateJwt({
      id,
      role
    });

    return { user, token };
  }

  static async removeAdmin(doc: { id: string }): Promise<string> {
    const { id } = doc;
    const user = await this.findIdCheck(id);
    await user.destroy();
    return 'Success';
  }

  static async createUser(doc: TUserCreate): Promise<TUser> {
    const params = UserCreateSchema.parse(doc);
    const { email } = params;
    const existedUser = await UserModel.findOne({ where: { email } });
    if (existedUser) {
      throw new Error('Email already exists');
    }
    return await UserModel.create(params);
  }
}
