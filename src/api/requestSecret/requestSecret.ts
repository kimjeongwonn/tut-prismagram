import { schema } from 'nexus';
import { generateSecret } from './secetWord';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('requestSecret', {
      args: {
        email: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { email } = args;
        const secret = generateSecret();
        console.log(secret);
        try {
          await ctx.db.user.update({ where: { email }, data: { loginSecret: secret } });
          return true;
        } catch (err) {
          throw new Error(err);
        }
      },
    });
  },
});
