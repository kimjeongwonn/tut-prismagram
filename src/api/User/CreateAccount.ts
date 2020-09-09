import { schema } from 'nexus';

schema.mutationType({
  definition(t) {
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
  },
});
