import { gql } from 'graphql-modules'

export const Workspace = gql`
  type Query {
    workspace(id: String!): Workspace
  }
  type Workspace {
    id: Int
    name: String
    description: String
    createdAt: Date
    updatedAt: Date
    admin: Int
    collaborators: [Int]
    projects: [Int]
    img: string
  }
`
