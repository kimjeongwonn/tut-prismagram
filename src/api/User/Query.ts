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
      resolve(_root, args, ctx) {
        return ctx.db.user
          .findOne({
            where: { id: args.id },
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              bio: true,
              posts: true,
              followers: true,
              followings: true,
            },
          })
          .then();
      },
    });
    t.field('seeMy', {
      type: 'User',
      async resolve(_, __, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx;
        return await ctx.db.user
          .findOne({
            where: { id: user.id },
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
              bio: true,
              posts: true,
              followers: true,
              followings: true,
            },
          })
          .then();
      },
    });
  },
});
