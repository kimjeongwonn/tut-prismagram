import * as schema from '@nexus/schema';

//defined type
export const User = schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.profileImage();
    // model.email();
    t.model.firstName();
    t.model.lastName();
    t.string('fullName', {
      resolve(root, _, __) {
        return `${root.firstName} ${root.lastName}`;
      },
    });
    t.model.bio();
    // t.model.('loginSecret');
    t.int('followersCount', {
      resolve(root, _, ctx) {
        return ctx.prisma.user.count({ where: { followings: { some: { id: root.id } } } });
      },
    });
    t.model.followers();
    t.int('followingsCount', {
      resolve(root, _, ctx) {
        return ctx.prisma.user.count({ where: { followers: { some: { id: root.id } } } });
      },
    });
    t.model.followings();
    t.boolean('isSelf', {
      async resolve(root, _, ctx) {
        return root.id === ctx.req.user.id;
      },
    });
    t.boolean('isFollowing', {
      async resolve(root, _, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx.req;
        const result = await ctx.prisma.user.findMany({
          where: {
            AND: [{ id: user.id }, { followings: { some: { id: root.id } } }],
          },
        });
        return Boolean(result[0]);
      },
    });
    t.model.posts();
    // t.model.likes()
    // t.model.comments();
    // t.model.participatings();
    // t.model.messages();
    t.int('postsCount', {
      resolve(root, _, ctx) {
        return ctx.prisma.post.count({ where: { userId: root.id } });
      },
    });
  },
});
