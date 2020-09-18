import { FindManyMessageArgs } from '@prisma/client';
import { schema } from 'nexus';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('seeMyRooms', {
      type: 'Room',
      resolve(_, __, ctx) {
        ctx.isAuthenticated();
        return ctx.db.user.findOne({ where: { id: ctx.user.id } }).participatings();
      },
    });
  },
});
