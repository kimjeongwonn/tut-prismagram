import * as schema from '@nexus/schema';

export const UserQuery = schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.prisma.user.findMany();
      },
    });
    t.field('seeUser', {
      type: 'User',
      args: {
        id: schema.stringArg({ required: true }),
      },
      /// @ts-ignore
      resolve(_, args, ctx, info) {
        return ctx.prisma.user.findOne({
          where: { id: args.id },
          select: {
            participatings: false,
            messages: false,
            loginSecret: false,
            email: false,
            comments: false,
            likes: false,
          },
        });
      },
    });
    t.field('seeMy', {
      type: 'User',
      /// @ts-ignore
      async resolve(_, __, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx.req;
        return await ctx.prisma.user.findOne({
          where: { id: user.id },
        });
      },
    });
  },
});
