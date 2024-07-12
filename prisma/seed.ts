import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'Alice',
    lastName: 'william',
    role: 'ADMIN',
    email: 'alice@prisma.io',
    password: '$2a$10$TLtC603wy85MM./ot/pvEec0w2au6sjPaOmLpLQFbxPdpJH9fDwwS', // myPassword42
    projects: {
      create: [
        {
          title: 'Join the Prisma Discord',
          description: 'https://pris.ly/discord',
          delivered: true,
        },
      ],
    },
  },
  {
    firstName: 'Nilu',
    lastName: 'loan',
    role: 'ADMIN',
    email: 'nilu@prisma.io',
    password: '$2a$10$k2rXCFgdmO84Vhkyb6trJ.oH6MYLf141uTPf81w04BImKVqDbBivi', // random42
    projects: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          description: 'https://www.twitter.com/prisma',
          delivered: true,
        },
      ],
    },
  },
  {
    firstName: 'Mahmoud',
    lastName: 'mah',
    role: 'PARTICIPANT',
    email: 'mahmoud@prisma.io',
    password: '$2a$10$lTlNdIBQvCho0BoQg21KWu/VVKwlYsGwAa5r7ctOV41EKXRQ31ING', // iLikeTurtles42
    projects: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          description: 'https://www.github.com/prisma/prisma/discussions',
          delivered: true,
        },
        {
          title: 'Prisma on YouTube',
          description: 'https://pris.ly/youtube',
          delivered: true,
        },
      ],
    },
  },
]

const workspaceData: Prisma.WorkSpaceCreateInput[] = [
  {
    name: 'wereact',
    description: 'it dev',
    createdAt: '2017-08-12',
    admin: {
      create: {
        firstName: 'Alice',
        lastName: 'william',
        role: 'ADMIN',
        email: 'alice@prisma.io',
        password: '$2a$10$TLtC603wy85MM./ot/pvEec0w2au6sjPaOmLpLQFbxPdpJH9fDwwS', // myPassword42

      },
    },
    collaborator: {
      create: [],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
