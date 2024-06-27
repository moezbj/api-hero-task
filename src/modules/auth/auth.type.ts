import { gql } from 'graphql-modules'

export const AuthType = gql`
  type Mutation {
    login(password: String!, email: String!): LoginResponse
  }
  type Auth {
    email: String
    password: String
  }
  type Token {
    tokenType: String
    accessToken: String
    refreshToken: String
    expiresIn: String
  }
  type LoginResponse {
    user: User
    token: Token
  }
`
