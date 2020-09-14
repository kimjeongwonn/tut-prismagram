import { schema } from 'nexus';
import { arg, stringArg } from 'nexus/components/schema';
import { create } from 'nexus/dist/runtime/schema';
import { resolve } from 'path';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    //좋아요 토글 <--
    t.boolean('toggleLike', {
      args: {
        postId: schema.intArg({ required: true }),
      },
      async resolve(root, args, ctx) {
        ctx.isAuthenticated();
        const { postId } = args;
        const user = await ctx.user;
        const isLike = await ctx.db.user.findMany({ where: { id: user.id, likes: { some: { id: postId } } } });
        if (isLike[0]) {
          await ctx.db.user.update({
            where: { id: user.id },
            data: { likes: { disconnect: { id: postId } } },
          });
          return false;
        } else {
          await ctx.db.user.update({
            where: { id: user.id },
            data: { likes: { connect: { id: postId } } },
          });
          return true;
        }
      },
    });
    //--> 좋아요 토글
    //댓글 달기 <--
    t.field('addComment', {
      type: 'Comment',
      args: {
        text: schema.stringArg({ required: true }),
        postId: schema.intArg({ required: true }),
      },
      async resolve(_, args, ctx) {
        const addedComment = await ctx.db.comment.create({
          data: {
            user: { connect: { id: ctx.user.id } },
            post: { connect: { id: args.postId } },
            text: args.text,
          },
        });
        return addedComment;
      },
    });
    //--> 댓글 달기
  },
});
