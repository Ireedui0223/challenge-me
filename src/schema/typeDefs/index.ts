import { mergeTypeDefs } from '@graphql-tools/merge';

import fileType from './file/file.type';
import globalTypeDefs from './global.type';
import userType from './user/user.type';

export const mergedGQLSchema = mergeTypeDefs([
  fileType,
  globalTypeDefs,
  userType
]);
