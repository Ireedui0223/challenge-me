import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import { ROLE } from '../types/role.type';

export function authDirective(schema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = function (root, args, context, info) {
          try {
            const typeLevelPermissions = authDirective?.permissions ?? [];
            if (!context || context.role === ROLE.UNAUTH)
              throw new Error('Unauthorized access');
            if (
              typeLevelPermissions.length > 0 &&
              !typeLevelPermissions.includes(context.role)
            ) {
              throw new Error('Permission denied');
            }
            return resolve(root, args, context, info);
          } catch (err) {
            return { success: false, message: err.message };
          }
        };
        return fieldConfig;
      }
    }
  });
}

export function authLogin(schema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authLogin = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (authLogin) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = function (root, args, context, info) {
          try {
            if (!context || context.role === ROLE.UNAUTH)
              throw new Error('Та нэвтрээгүй байна');
            return resolve(root, args, context, info);
          } catch (err) {
            return { success: false, message: err.message };
          }
        };
        return fieldConfig;
      }
    }
  });
}
