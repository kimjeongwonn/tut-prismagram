import { schema } from 'nexus';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    //계정생성 <--
    t.field('createAccount', {
      type: 'User',
      args: {
        username: schema.stringArg({ required: true }),
        email: schema.stringArg({ required: true }),
        firstName: schema.stringArg({ required: false }),
        lastName: schema.stringArg({ required: false }),
        bio: schema.stringArg({ required: false }),
      },
      async resolve(root, args, ctx) {
        const { username, email, firstName, lastName, bio } = args;
        const newUser = await ctx.db.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            bio,
          },
        });
        return newUser;
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
        const { id: userId } = ctx.user;
        const { followId } = args;
        const isFollowing = await ctx.db.user.findMany({
          where: {
            AND: [{ id: userId }, { followings: { some: { id: followId } } }],
          },
        });
        if (isFollowing[0]) {
          await ctx.db.user.update({ where: { id: userId }, data: { followings: { disconnect: { id: followId } } } });
          return false;
        } else {
          await ctx.db.user.update({ where: { id: userId }, data: { followings: { connect: { id: followId } } } });
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
        const { user } = ctx;
        return ctx.db.user.update({
          where: { id: user.id },
          data: { username: username!, firstName, lastName, bio },
        });
      },
    });
    //--> 정보 수정
  },
});
