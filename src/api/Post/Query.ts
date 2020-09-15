import { schema } from 'nexus';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('seeUserPosts', {
      type: 'Post',
      args: {
        userId: schema.stringArg({ required: true }),
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
        return ctx.db.post.findMany({ where: { userId: user.id } });
      },
    });
    t.field('seePost', {
      type: 'Post',
      args: { postId: schema.intArg({ required: true }) },
      resolve(_, args, ctx) {
        return ctx.db.post.findOne({ where: { id: args.postId } }).then();
      },
    });
  },
});
