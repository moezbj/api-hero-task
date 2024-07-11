import { isTokenValid } from '@/middlewares/generateToken'
import prisma from '../../config/prisma'
import { InternalAppContext } from 'graphql-modules/application/application'

export const projectResolver = {
  Query: {
    listProjects: async (
      parent: Record<string, any>,
      args: Record<string, any>,
      contextValue: any,
      info: any,
    ) => {
      console.log('contextValue', contextValue);
      const list = await prisma.project.findMany({
        where: {
          ownerId: 1,
        },
      })
      return list
    },
  },
  Mutation: {
    createProject: async (
      parent: undefined,
      args: any,
      context: InternalAppContext,
    ) => {
      console.log('args', args)
      const existProject = await prisma.project.findFirst({
        where: {
          title: args.title,
        },
      })
      if (existProject) throw new Error('Project already exist')

      const existUser = await prisma.user.findFirst({
        where: {
          id: Number(args.owner),
        },
      })
      if (!existUser) throw new Error('user already exist')
      const [createProject] = await prisma.$transaction([
        prisma.project.create({
          data: {
            title: args.title,
            description: args.description,
            delivered: args.delivered,
            ownerId: existUser.id,
          },
        }),
      ])
      console.log('createProject', createProject)
      return createProject
    },
  },
}