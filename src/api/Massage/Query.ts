import * as schema from '@nexus/schema';

export const MessageQuery = schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('seeMyRooms', {
      type: 'Room',
      resolve(_, __, ctx) {
        ctx.isAuthenticated();
        return ctx.prisma.user.findOne({ where: { id: ctx.req.user.id } }).participatings();
      },
    });
  },
});
