import * as schema from '@nexus/schema';
import { FindManyPostArgs } from '@prisma/client';

export const PostQuery = schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('seeUserPosts', {
      type: 'Post',
      args: {
        userId: schema.idArg({ required: true }),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.post.findMany({ where: { userId: args.userId } });
      },
    });
    t.list.field('seeMyPosts', {
      type: 'Post',
      resolve(_, __, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx.req;
        return ctx.prisma.post.findMany({
          where: { userId: user.id },
        });
      },
    });
    t.field('seePost', {
      type: 'Post',
      args: { postId: schema.intArg({ required: true }) },
      resolve(_, args, ctx) {
        return ctx.prisma.post.findOne({ where: { id: args.postId } }).then();
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
          where: { user: { followers: { some: { id: ctx.req.user.id } } } },
          orderBy: { postAt: 'desc' },
          take: 10,
          skip: cursor ? 1 : 0,
        };
        if (cursor) findManyArgs.cursor = { id: cursor };
        return ctx.prisma.post.findMany(findManyArgs);
      },
    });
  },
});
