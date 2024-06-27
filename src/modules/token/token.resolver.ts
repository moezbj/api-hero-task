import prisma from '../../config/prisma'
import { isTokenValid } from '../../middlewares/generateToken'
import { generateTokenResponse } from '../../middlewares/generateUserToken'

export const TokenResolver = {
  Query: {
    validToken: async (args: any) => {
      await isTokenValid({
        token: args.refreshToken,
        type: 'REFRESH',
        user: Number(args.user),
      })

      const user = await prisma.user.findFirst({
        where: { id: Number(args.user) },
      })
      if (!user) throw new Error('Invalid token')

      const token = await generateTokenResponse(user.id)

      return { user, token }
    },
  },
}
