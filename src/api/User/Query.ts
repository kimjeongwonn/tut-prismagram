import { schema } from 'nexus';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
    t.field('seeUser', {
      type: 'User',
      args: {
        id: schema.stringArg({ required: true }),
      },
      /// @ts-ignore
      resolve(_, args, ctx, info) {
        return ctx.db.user.findOne({
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
      async resolve(_, __, ctx, info) {
        ctx.isAuthenticated();
        const { user } = ctx;
        return await ctx.db.user.findOne({
          where: { id: user.id },
        });
      },
    });
  },
});
