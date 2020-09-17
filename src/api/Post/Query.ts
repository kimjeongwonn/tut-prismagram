import { schema } from 'nexus';
import { FindManyPostArgs } from '@prisma/client';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('seeUserPosts', {
      type: 'Post',
      args: {
        userId: schema.idArg({ required: true }),
      },
      resolve(_, args, ctx) {
        return ctx.db.post.findMany({ where: { userId: args.userId } });
      },
    });
    t.list.field('seeMyPosts', {
      type: 'Post',
      resolve(_, __, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx;
        return ctx.db.post.findMany({
          where: { userId: user.id },
        });
      },
    });
    t.field('seePost', {
      type: 'Post',
      args: { postId: schema.intArg({ required: true }) },
      resolve(_, args, ctx) {
        return ctx.db.post.findOne({ where: { id: args.postId } }).then();
      },
    });
    t.list.field('seeFeed', {
      type: 'Post',
      args: {
        cursor: schema.intArg({ required: false }),
      },
      resolve(_, { cursor }, ctx) {
        ctx.isAuthenticated();
        const findManyArgs: FindManyPostArgs = {
          where: { user: { followers: { some: { id: ctx.user.id } } } },
          orderBy: { postAt: 'desc' },
          take: 3,
          skip: cursor ? 1 : 0,
        };
        if (cursor) findManyArgs.cursor = { id: cursor };
        return ctx.db.post.findMany(findManyArgs);
      },
    });
  },
});
