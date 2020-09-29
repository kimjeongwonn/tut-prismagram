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
        id: schema.stringArg({ required: true }),
      },
      /// @ts-ignore
      resolve(_, args, ctx, info) {
        return ctx.prisma.user.findOne({
          where: { id: args.id },
        });
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
