import { createApplication } from 'graphql-modules'
import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { AuthModule } from './auth/auth.module'
import { TokenModule } from './token/token.module'

export const application = createApplication({
  modules: [ProjectModule, UserModule, AuthModule, TokenModule],
})
