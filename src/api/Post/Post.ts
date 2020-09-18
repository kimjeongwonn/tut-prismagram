import { schema } from 'nexus';

schema.objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.location();
    t.model.caption();
    t.model.files({ pagination: false });
    t.model.likes();
    t.boolean('isLike', {
      async resolve(root, _, ctx) {
        ctx.isAuthenticated();
        const result = await ctx.db.user.findMany({
          where: { AND: [{ id: ctx.user.id }, { likes: { some: { id: root.id } } }] },
        });
        return Boolean(result[0]);
      },
    });
    t.model.comments();
    t.model.user();
    t.int('likesCount', {
      resolve(root, _, ctx) {
        return ctx.db.user.count({ where: { likes: { some: { id: root.id } } } });
      },
    });
    t.int('commentsCount', {
      resolve(root, _, ctx) {
        return ctx.db.comment.count({ where: { postId: root.id } });
      },
    });
    t.model.postAt();
  },
});

schema.objectType({
  name: 'File',
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.post();
  },
});

schema.objectType({
  name: 'Comment',
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.post();
    t.model.user();
  },
});

schema.objectType({
  name: 'FeedList',
  definition(t) {
    t.list.field('posts', {
      type: 'Post',
    });
  },
});
