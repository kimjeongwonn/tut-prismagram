import { FindManyMessageArgs } from '@prisma/client';
import { schema } from 'nexus';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('seeMyRooms', {
      type: 'Room',
      resolve(_, __, ctx) {
        ctx.isAuthenticated();
        return ctx.db.user.findOne({ where: { id: ctx.user.id } }).rooms();
      },
    });
    t.field('seeRoom', {
      type: 'Room',
      args: {
        roomId: schema.intArg({ required: true }),
      },
      // @ts-ignore
      resolve(_, { roomId }, ctx) {
        return ctx.db.room.findOne({ where: { id: roomId } });
      },
    });
    t.list.field('seeMessages', {
      type: 'Message',
      args: {
        roomId: schema.intArg({ required: true }),
        cursor: schema.intArg({ required: false }),
      },
      resolve(_, { roomId, cursor }, ctx) {
        const findManyArgs: FindManyMessageArgs = { orderBy: { timeStamp: 'desc' }, take: 20, skip: cursor ? 1 : 0 };
        if (cursor) findManyArgs.cursor = { id: cursor };
        return ctx.db.room.findOne({ where: { id: roomId } }).messages(findManyArgs);
      },
    });
  },
});
