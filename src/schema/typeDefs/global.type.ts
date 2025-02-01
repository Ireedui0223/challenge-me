export const Pagination = `limit: Int = 10, page: Int = 1`;

export default `#graphql
    directive @authLogin on OBJECT | FIELD_DEFINITION
    directive @auth(permissions: [String!]) on FIELD_DEFINITION
    
     interface IResponse {
        success: Boolean
        message: String
    }
    
    type Response implements IResponse {
        success: Boolean!
        message: String!
    }

    type DateRange {
        startDate: Date
        endDate: Date
    }

    input DateRangeInput {
        startDate: Date
        endDate: Date
    }

    type Quantity {
        min: Int
        max: Int
    }

    input QuantityInput {
        min: Int
        max: Int
    }

    scalar Date
    type Mutation {connect:String}
    type Query {connect:String}
    
`;
