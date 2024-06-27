import prisma from '../../config/prisma'
import bcrypt from 'bcryptjs'
import { generateTokenResponse } from '../../middlewares/generateUserToken'

interface AuthType {
  email: string
  password: string
}

export const authResolves = {
  Mutation: {
    login: async (parent: any, args: AuthType) => {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: args.email }, { password: args.password }] },
      })

      if (!user || !(await bcrypt.compare(args.password, user.password))) {
        throw new Error('LOGIN.INCORRECT')
      }

      if (user && !user?.isActive) {
        throw new Error('LOGIN.BLOCKED')
      }
      console.log('here', user)

      const token = await generateTokenResponse(user.id)
      return { token, user }
    },
  },
}
