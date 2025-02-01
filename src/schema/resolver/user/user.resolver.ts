import { UserController } from '../../../controller/user/user.controller';

export default {
  Query: {
    getCurrentUser: async (_, __, context) => {
      try {
        return {
          success: true,
          message: 'Success',
          user: await UserController.getCurrentUser(context)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    getAllUser: async (_, doc, context) => {
      try {
        const { count, rows } = await UserController.getAllUser(doc, context);
        return {
          success: true,
          message: 'Success',
          users: rows,
          count
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    getUser: async (_, doc) => {
      try {
        return {
          success: true,
          message: 'Success',
          user: await UserController.getUser(doc)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    }
  },
  Mutation: {
    login: async (_, doc, __) => {
      try {
        const { user, token } = await UserController.login(doc);
        return {
          success: true,
          message: 'Амжилттай нэвтэрлээ',
          user,
          token
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    removeAdmin: async (_, doc) => {
      try {
        return {
          success: true,
          message: await UserController.removeAdmin(doc)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    }
  }
};
