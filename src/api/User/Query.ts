import * as schema from '@nexus/schema';
import { User } from '@prisma/client';

export const UserQuery = schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.prisma.user.findMany();
      },
    });
    t.field('seeUser', {
      type: 'User',
      args: {
        id: schema.stringArg({ required: false }),
        username: schema.stringArg({ required: false }),
      },
      /// @ts-ignore
      async resolve(_, args, ctx, info) {
        if (args.id) {
          return ctx.prisma.user.findOne({
            where: { id: args.id },
          });
        } else if (args.username) {
          const userArray = await ctx.prisma.user.findMany({ where: { username: args.username } });
          return userArray[0];
        } else {
          throw new Error('arguments 중 하나는 입력해야 합니다');
        }
      },
    });
    t.field('seeMy', {
      type: 'User',
      /// @ts-ignore
      async resolve(_, __, ctx) {
        ctx.isAuthenticated();
        const { user } = ctx.req;
        return await ctx.prisma.user.findOne({
          where: { id: user.id },
        });
      },
    });
    t.boolean('checkUser', {
      args: {
        username: schema.stringArg({ required: false }),
        email: schema.stringArg({ required: false }),
      },
      async resolve(_, { username, email }, ctx) {
        const user = email
          ? await ctx.prisma.user.findOne({ where: { email } })
          : username
          ? await ctx.prisma.user.findOne({ where: { username } })
          : false;
        return Boolean(user);
      },
    });
  },
});
