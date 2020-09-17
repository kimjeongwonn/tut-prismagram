import { schema } from 'nexus';

const checkPostUser = async (args: { postId: number }, ctx: NexusContext) => {
  const isMine = await ctx.db.user.count({ where: { id: ctx.user.id, posts: { some: { id: args.postId } } } });
  if (!isMine) throw Error('권한이 없습니다!');
};

schema.enumType({
  name: 'PostAction',
  members: ['EDIT', 'DELETE'],
});

schema.extendType({
  type: 'Mutation',
  definition(t) {
    //게시글 업로드 <--
    t.field('writePost', {
      type: 'Post',
      args: {
        caption: schema.stringArg({ required: false }),
        location: schema.stringArg({ required: false }),
        url: schema.stringArg({ required: true, list: true }),
      },
      async resolve(_, args, ctx) {
        ctx.isAuthenticated();
        const { caption, location, url } = args;
        return ctx.db.post.create({
          data: {
            user: { connect: { id: ctx.user.id } },
            caption,
            location,
            files: { create: url.map((url) => ({ url })) },
          },
        });
      },
    });
    //--> 게시글 업로드
    //게시글 삭제/수정 <--
    t.field('modifyPost', {
      type: 'Post',
      nullable: true,
      args: {
        postId: schema.intArg({ required: true }),
        caption: schema.stringArg({ required: false }),
        location: schema.stringArg({ required: false }),
        action: schema.arg({ type: 'PostAction', required: true }),
      },
      async resolve(_, args, ctx) {
        const { postId, caption, location, action } = args;
        ctx.isAuthenticated();
        await checkPostUser(args, ctx);
        switch (action) {
          case 'EDIT':
            return await ctx.db.post.update({
              where: { id: postId },
              data: {
                caption,
                location,
              },
            });
          case 'DELETE':
            await ctx.db.comment.deleteMany({
              where: { postId },
            });
            await ctx.db.file.deleteMany({
              where: { postId },
            });
            return ctx.db.post.delete({ where: { id: postId } });
        }
      },
    });
    //--> 게시글 수정
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
