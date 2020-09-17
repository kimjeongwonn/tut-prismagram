import { schema } from 'nexus';

//defined type
schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.email();
    t.model.firstName();
    t.model.lastName();
    t.string('fullName', {
      resolve(root, _, __) {
        return `${root.firstName} ${root.lastName}`;
      },
    });
    t.model.bio();
    t.model.loginSecret();
    t.int('followersCount', {
      resolve(root, _, ctx) {
        return ctx.db.user.count({ where: { followings: { some: { id: root.id } } } });
      },
    });
    t.model.followers();
    t.int('followingsCount', {
      resolve(root, _, ctx) {
        return ctx.db.user.count({ where: { followers: { some: { id: root.id } } } });
      },
    });
    t.model.followings();
    t.boolean('isSelf', {
      async resolve(root, _, ctx) {
        return root.id === ctx.user.id;
      },
    });
    t.boolean('isFollowing', {
      async resolve(root, _, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx;
        const result = await ctx.db.user.findMany({
          where: {
            AND: [{ id: user.id }, { followings: { some: { id: root.id } } }],
          },
        });
        return Boolean(result[0]);
      },
    });
    t.model.posts();
    t.model.likes();
    t.model.comments();
    t.model.rooms();
    t.model.messages();
    t.int('postsCount', {
      resolve(root, _, ctx) {
        return ctx.db.post.count({ where: { userId: root.id } });
      },
    });
  },
});
