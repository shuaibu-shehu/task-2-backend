import {PrismaClient} from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

export const db = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = db
}


db.$connect()
  .then(() => {
    console.log('Prisma connected successfully');
  })
  .catch((e) => {
    console.error('Prisma connection error', e);
});