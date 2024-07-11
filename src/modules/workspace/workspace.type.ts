import { gql } from 'graphql-modules'

export const Workspace = gql`
  type Query {
    workspace(id: String!): Workspace
    listWorkspaces: [Workspace]

  }
  type Mutation {
    createWorkspace(
      name: String
      description: String
      admin: Int
    ): Workspace
  }
  type Workspace {
    id: Int
    name: String
    description: String
    createdAt: String
    updatedAt: String
    admin: Int
    collaborators: [Int]
    projects: [Int]
    img: String
  }
`
