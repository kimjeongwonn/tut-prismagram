import { FindManyMessageArgs } from '@prisma/client';
import { schema } from 'nexus';
import { tmpdir } from 'os';

schema.objectType({
  name: 'Message',
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.fromUser();
    t.model.room();
    t.model.timeStamp();
  },
});

schema.objectType({
  name: 'Room',
  definition(t) {
    t.model.id();
    t.model.participant({ pagination: false });
    t.model.messages();
    t.list.field('seeMessages', {
      type: 'Message',
      args: {
        cursor: schema.intArg({ required: false }),
      },
      resolve(root, { cursor }, ctx) {
        const findManyArgs: FindManyMessageArgs = { orderBy: { timeStamp: 'desc' }, take: 20, skip: cursor ? 1 : 0 };
        if (cursor) findManyArgs.cursor = { id: cursor };
        return ctx.db.room.findOne({ where: { id: root.id } }).messages(findManyArgs);
      },
    });
  },
});
