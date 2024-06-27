import { createModule } from 'graphql-modules'
import { projectResolver } from './project.resolver'
import { Project } from './project.type'

export const ProjectModule = createModule({
  id: 'project',
  dirname: __dirname,
  typeDefs: [Project],
  resolvers: [projectResolver],
})
