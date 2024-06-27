import { permissions } from '../permissions'
import { APP_SECRET, getUserId } from '../utils/utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { applyMiddleware } from 'graphql-middleware'
import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../utils/context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.nullable.field('projectById', {
      type: 'Project',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.project.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    /*  t.nonNull.list.nonNull.field('feed', {
      type: 'Project',
      args: {
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'ProjectOrderByUpdatedAtInput',
        }),
      },
      resolve: (_parent, args, context: Context) => {
        const or = args.searchString
          ? {
              OR: [
                { title: { contains: args.searchString } },
                { description: { contains: args.searchString } },
              ],
            }
          : {}

        return context.prisma.project.findMany({
          where: {
            delivered: true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        })
      },
    }) */

    t.list.field('projectsByUser', {
      type: 'Project',
      args: {
        userUniqueInput: nonNull(
          arg({
            type: 'UserUniqueInput',
          }),
        ),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: {
              id: args.userUniqueInput.id || undefined,
              email: args.userUniqueInput.email || undefined,
            },
          })
          .projects({
            where: {
              delivered: false,
            },
          })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createProject', {
      type: 'Project',
      args: {
        data: nonNull(
          arg({
            type: 'ProjectCreateInput',
          }),
        ),
      },
      resolve: (_, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.project.create({
          data: {
            title: args.data.title,
            description: args.data.description || '',
            delivered: args.data.delivered || false,
            ownerId: userId || 1,
          },
        })
      },
    })

    t.field('togglePublishProject', {
      type: 'Project',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context: Context) => {
        try {
          const project = await context.prisma.project.findUnique({
            where: { id: args.id || undefined },
            select: {
              delivered: true,
            },
          })
          return context.prisma.project.update({
            where: { id: args.id || undefined },
            data: { delivered: !project?.delivered },
          })
        } catch (e) {
          throw new Error(
            `Project with ID ${args.id} does not exist in the database.`,
          )
        }
      },
    })

    t.field('deleteProject', {
      type: 'Project',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.project.delete({
          where: { id: args.id },
        })
      },
    })
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('role')
    t.nonNull.string('email')
    t.nonNull.boolean('isActive'),
      t.list.field('projects', {
        type: 'Project',
        resolve: (parent, _, context: Context) => {
          return context.prisma.user
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .projects()
        },
      })
  },
})

const Project = objectType({
  name: 'Project',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('title')
    t.nonNull.string('description')
    t.nonNull.boolean('delivered')
    t.list.field('participants', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.project
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .owner()
      },
    })
  },
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const ProjectCreateInput = inputObjectType({
  name: 'ProjectCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.nonNull.string('description')
    t.nonNull.boolean('delivered')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.list.field('projects', { type: 'ProjectCreateInput' })
  },
})

/* const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
}) */

const schemaWithoutPermissions = makeSchema({
  types: [
    Query,
    Mutation,
    Project,
    User,
    // AuthPayload,
    UserUniqueInput,
    UserCreateInput,
    ProjectCreateInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('../utils/context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
