import { createApplication } from 'graphql-modules'
import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { AuthModule } from './auth/auth.module'
import { TokenModule } from './token/token.module'
import { WorkspaceModule } from './workspace/workspace.module'

export const application = createApplication({
  modules: [
    ProjectModule,
    WorkspaceModule,
    UserModule,
    AuthModule,
    TokenModule,
  ],
})
