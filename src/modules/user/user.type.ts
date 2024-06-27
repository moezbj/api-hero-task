import { gql } from 'graphql-modules'

export const User = gql`
  type Query {
    user(id: ID!): User
  }
  type User {
    id: String
    firstName: String
    lastName: String
    email: String
    isActive: Boolean
    company: String
    role: String
  }
`
