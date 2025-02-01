import { ROLE, ROLE_FILTER } from '../../../types/role.type';
import { Pagination } from '../global.type';

const LoginInput = `
    email: String!
    password: String!
`;

export default `#graphql
    enum ROLE {
        ${ROLE.ADMIN}
        ${ROLE.SUPER_ADMIN}
        ${ROLE.USER}
    }

    enum ROLE_FILTER {
        ${ROLE_FILTER.ADMIN}
        ${ROLE_FILTER.SUPER_ADMIN}
        ${ROLE_FILTER.USER}
        ${ROLE_FILTER.ALL}
    }

    type User {
        id: ID 
        phoneNumber: String
        email: String
        role: ROLE
        pushToken: String
        createdAt: Date
    }

    type UserResponse {
        success: Boolean
        message: String
        user: User
    }

    type UsersResponse {
        success: Boolean
        message: String
        users: [User]
        count: Int
    }
    
    type UserLoginResponse {
        success: Boolean
        message: String
        user: User
        token: String
    }

    extend type Mutation {
        removeAdmin(id: ID!): Response @auth(permissions: ["SUPER_ADMIN"])
        login(${LoginInput}): UserLoginResponse
    }

    extend type Query {
        getAllUser(email: String, phoneNumber: String, role:ROLE_FILTER, searchParam: String ${Pagination}): UsersResponse @auth(permissions: ["SUPER_ADMIN"])
        getUser(id:ID!): UserResponse @auth(permissions: ["SUPER_ADMIN"])
        getCurrentUser: UserResponse @auth(permissions: ["SUPER_ADMIN"])
    }
`;
