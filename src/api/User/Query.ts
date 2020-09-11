import { schema } from 'nexus';
import { setupMaster } from 'cluster';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      async resolve(_root, _args, ctx) {
        return await ctx.db.user.findMany();
      },
    });
    t.field('userById', {
      type: 'User',
      args: {
        id: schema.stringArg({ required: false }),
        username: schema.stringArg({ required: false }),
      },
      resolve(_root, args, ctx) {
        return ctx.db.user.findOne({ where: { id: args.id!, username: args.username! } });
      },
    });
  },
});
