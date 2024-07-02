import { gql } from 'graphql-modules'

export const Project = gql`
  type Project {
    id: String
    title: String
    description: String
    delivered: Boolean
    owner: Int
  }

  type Query {
    project(id: ID!): Project
    listProjects: [Project]
  }
  type Mutation {
    createProject(
      title: String
      description: String
      delivered: Boolean
      owner: Int
    ): Project
  }
`
export interface ProjectType {
  id: string
  title: string
  description: string
  delivered: boolean
  owner: number
}
