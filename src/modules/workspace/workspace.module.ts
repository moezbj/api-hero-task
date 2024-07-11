import { createModule } from 'graphql-modules'
import { Workspace } from './workspace.type'
import { workspaceResolver } from './workspace.resolvers'

export const WorkspaceModule = createModule({
  id: 'workspace',
  dirname: __dirname,
  typeDefs: [Workspace],
  resolvers: [workspaceResolver],
})
