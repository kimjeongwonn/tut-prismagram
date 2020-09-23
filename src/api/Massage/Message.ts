import { FindManyMessageArgs } from '@prisma/client';
import * as schema from '@nexus/schema';
import { tmpdir } from 'os';

export const Message = schema.objectType({
  name: 'Message',
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.fromUser();
    t.model.room();
    t.model.timeStamp();
  },
});

export const Room = schema.objectType({
  name: 'Room',
  definition(t) {
    t.model.id();
    t.model.participant();
    t.model.messages();
    t.list.field('seeMessages', {
      type: 'Message',
      args: {
        cursor: schema.intArg({ required: false }),
      },
      resolve(root, { cursor }, ctx) {
        const findManyArgs: FindManyMessageArgs = { orderBy: { timeStamp: 'desc' }, take: 20, skip: cursor ? 1 : 0 };
        if (cursor) findManyArgs.cursor = { id: cursor };
        return ctx.prisma.room.findOne({ where: { id: root.id } }).messages(findManyArgs);
      },
    });
  },
});
