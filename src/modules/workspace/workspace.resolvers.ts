import { getUser } from '../../middlewares/getUser'
import prisma from '../../config/prisma'

export const workspaceResolver = {
  Query: {
    listWorkspaces: async (
      parent: Record<string, any>,
      args: Record<string, any>,
      context: any,
      info: any,
    ) => {
      const getIdUser = await getUser(context.authorization.split(' ')[1])
      if (!getIdUser) throw new Error('id not provided')
      const existUser = await prisma.user.findFirst({
        where: {
          id: Number(getIdUser.sub),
        },
      })
      if (!existUser) throw new Error("user dosen't exist")

      const list = await prisma.workSpace.findMany({
        where: {
          adminId: existUser.id,
        },
      })
      return list
    },
  },
  Mutation: {
    createWorkspace: async (parent: undefined, args: any, context: any) => {
      const getIdUser = await getUser(context.authorization.split(' ')[1])
      if (!getIdUser) throw new Error('id not provided')
      const existUser = await prisma.user.findFirst({
        where: {
          id: Number(getIdUser.sub),
        },
      })
      if (!existUser) throw new Error("user dosen't exist")

      const existWorkspace = await prisma.workSpace.findFirst({
        where: {
          name: args.name,
          adminId: existUser.id,
        },
      })
      if (existWorkspace) throw new Error('workspace already exist')

      const [createWorkspace] = await prisma.$transaction([
        prisma.workSpace.create({
          data: {
            name: args.name,
            description: args.description,
            adminId: existUser.id,
          },
        }),
      ])
      return createWorkspace
    },
  },
}
