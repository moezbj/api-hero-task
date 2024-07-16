import prisma from '../../config/prisma'
import bcrypt from 'bcryptjs'
import { generateTokenResponse } from '../../middlewares/generateUserToken'
import { getUser } from '../../middlewares/getUser'
import { isTokenValid } from '../../middlewares/generateToken'
import { TOKEN_TYPE } from '@prisma/client'

interface AuthType {
  email: string
  password: string
}

interface RegisterType {
  email: string
  firstName: string
  lastName: string
  company?: string
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
      const token = await generateTokenResponse(user.id)
      return { token, user }
    },
    register: async (parent: any, args: RegisterType) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      })

      if (user) {
        throw new Error('USER ALREADY EXISTS')
      }

      const createdUser = await prisma.user.create({
        data: {
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
          role: 'ADMIN',
          password: args.password,
        },
      })
      console.log('here', createdUser)

      const token = await generateTokenResponse(createdUser.id)
      return { token, user: createdUser }
    },
    logout: async (parent: any, args: any, contextValue: any) => {
      const getIdUser = await getUser(contextValue.authorization.split(' ')[1])
      if (!getIdUser) throw new Error('id not provided')
      const existUser = await prisma.user.findFirst({
        where: {
          id: Number(getIdUser.sub),
        },
      })
      if (!existUser) throw new Error("user dosen't exist")
      await isTokenValid({
        token: args.token,
        type: TOKEN_TYPE.REFRESH,
        user: existUser.id,
      })
      return 'done'
    },
  },
  /* Query: {
    profile: (parent: any, args: unknown, context: any) => {
      console.log('poias', context.req.user)
      return context.req.user
    },
  }, */
}
