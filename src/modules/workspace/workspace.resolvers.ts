import prisma from '../../config/prisma'
import { InternalAppContext } from 'graphql-modules/application/application'

export const workspaceResolver = {
  Query: {
    listWorkspaces: async (
      parent: Record<string, any>,
      args: Record<string, any>,
      contextValue: any,
      info: any,
    ) => {
      const list = await prisma.workSpace.findMany({
        where: {
          adminId: 1,
        },
      })
      return list
    },
  },
  Mutation: {
    createWorkspace: async (
      parent: undefined,
      args: any,
      context: InternalAppContext,
    ) => {
      const existWorkspace = await prisma.workSpace.findFirst({
        where: {
          name: args.title,
        },
      })
      if (existWorkspace) throw new Error('workspace already exist')

      const existUser = await prisma.user.findFirst({
        where: {
          id: Number(args.owner),
        },
      })
      if (!existUser) throw new Error("user dosen't exist")
      const [createWorkspace] = await prisma.$transaction([
        prisma.workSpace.create({
          data: {
            name: args.title,
            description: args.description,
            adminId: existUser.id,
          },
        }),
      ])
      console.log('createProject', createWorkspace)
      return createWorkspace
    },
  },
}
