import * as schema from '@nexus/schema';

export const Post = schema.objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.location();
    t.model.caption();
    t.model.files();
    t.model.likes();
    t.boolean('isLike', {
      async resolve(root, _, ctx) {
        ctx.isAuthenticated();
        const result = await ctx.prisma.user.findMany({
          where: { AND: [{ id: ctx.req.user.id }, { likes: { some: { id: root.id } } }] },
        });
        return Boolean(result[0]);
      },
    });
    t.model.comments();
    t.model.user();
    t.int('likesCount', {
      resolve(root, _, ctx) {
        return ctx.prisma.user.count({ where: { likes: { some: { id: root.id } } } });
      },
    });
    t.int('commentsCount', {
      resolve(root, _, ctx) {
        return ctx.prisma.comment.count({ where: { postId: root.id } });
      },
    });
    t.model.postAt();
  },
});

export const File = schema.objectType({
  name: 'File',
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.post();
  },
});

export const Comment = schema.objectType({
  name: 'Comment',
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.post();
    t.model.user();
  },
});
