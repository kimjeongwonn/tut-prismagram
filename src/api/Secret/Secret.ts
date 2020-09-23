import * as schema from '@nexus/schema';
import { generateSecret, sendSecretMail, generateToken } from './util';

export const AutoPayload = schema.objectType({
  name: 'AutoPayload',
  definition(t) {
    t.string('token');
    t.field('approvedUser', {
      type: 'User',
    });
  },
});

export const SecretMutation = schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('requestSecret', {
      args: {
        email: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { email } = args;
        const secret = generateSecret();
        try {
          const user = await ctx.prisma.user.update({ where: { email }, data: { loginSecret: secret } });
          if (user) {
            await sendSecretMail(email, secret);
          }
          return true;
        } catch (err) {
          throw new Error(err);
        }
      },
    });
    t.string('confirmSecret', {
      args: {
        secret: schema.stringArg({ required: true }),
        email: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { email, secret } = args;
        const user = await ctx.prisma.user.findOne({ where: { email } });
        if (user?.loginSecret === secret) {
          await ctx.prisma.user.update({ where: { id: user.id }, data: { loginSecret: '' } });
          return generateToken(user.id); //0-2. 사용자의 아이디를 담은 토큰을 반환
        } else {
          throw Error('Wrong email/secret conviation');
        }
      },
    });
  },
});
