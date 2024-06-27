import { gql } from 'graphql-modules'

export const TokenType = gql`
type Query {
  validToken(refreshToke:String!, type:String!, userId:String!): String
}
  type TokenType {
    tokenType: String
    accessToken: String
    refreshToken: String
    expiresIn: Int
  }
`
