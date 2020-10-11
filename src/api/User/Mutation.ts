import * as schema from '@nexus/schema';

export const UserMutation = schema.extendType({
  type: 'Mutation',
  definition(t) {
    //계정생성 <--
    t.boolean('createAccount', {
      args: {
        username: schema.stringArg({ required: true }),
        email: schema.stringArg({ required: true }),
        firstName: schema.stringArg({ required: false }),
        lastName: schema.stringArg({ required: false }),
      },
      async resolve(_, { username, email, firstName, lastName }, ctx) {
        await ctx.prisma.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
          },
        });
        return true;
      },
    });
    //--> 계정생성
    //팔로잉 토글 <--
    t.boolean('followToggle', {
      args: {
        followId: schema.stringArg({ required: true }),
      },
      async resolve(_, args, ctx) {
        ctx.isAuthenticated();
        const { id: userId } = ctx.req.user;
        const { followId } = args;
        if (userId === followId) {
          throw new Error('자기 자신은 팔로우 할 수 없습니다');
        }
        const isFollowing = await ctx.prisma.user.findMany({
          where: {
            AND: [{ id: userId }, { followings: { some: { id: followId } } }],
          },
        });
        if (isFollowing[0]) {
          await ctx.prisma.user.update({
            where: { id: userId },
            data: { followings: { disconnect: { id: followId } } },
          });
          return false;
        } else {
          await ctx.prisma.user.update({ where: { id: userId }, data: { followings: { connect: { id: followId } } } });
          return true;
        }
      },
    });
    //--> 팔로잉 토글
    //정보 수정 <--
    t.field('editUser', {
      type: 'User',
      args: {
        username: schema.stringArg({ required: false }),
        firstName: schema.stringArg({ required: false }),
        lastName: schema.stringArg({ required: false }),
        bio: schema.stringArg({ required: false }),
      },
      resolve(_root, args, ctx) {
        ctx.isAuthenticated();
        const { username, firstName, lastName, bio } = args;
        const { user } = ctx.req;
        return ctx.prisma.user.update({
          where: { id: user.id },
          data: { username: username!, firstName, lastName, bio },
        });
      },
    });
    //--> 정보 수정
  },
});
