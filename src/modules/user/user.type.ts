import { gql } from 'graphql-modules'

export const User = gql`
  type Query {
    user(token: String!): User
  }
  type User {
    id: Int
    firstName: String
    lastName: String
    email: String
    isActive: Boolean
    company: String
    role: String
  }
`
