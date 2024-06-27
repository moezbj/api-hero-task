import { gql } from 'graphql-modules'

export const Project = gql`
  type Query {
    project(id: ID!): Project
  }
  type Project {
    id: String
    title: String
    description: String
    delivered: String
    isActive: Boolean
    owner: ID
  }
`
