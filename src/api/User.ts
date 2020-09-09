import { schema } from 'nexus';

//defined type
schema.objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('username');
    t.string('email');
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.string('bio', { nullable: true });
    t.list.field('followers', {
      type: 'User',
      resolve(root, _, ctx) {
        return ctx.db.user.findMany({ where: { id: root.id }, include: { followings: true } });
      },
    });
    t.list.field('followings', {
      type: 'User',
      resolve(root, _, ctx) {
        return ctx.db.user.findMany({ where: { id: root.id }, include: { followers: true } });
      },
    });
    t.list.field('posts', {
      type: 'Post',
      resolve(root, _, ctx) {
        return ctx.db.post.findMany({ where: { userId: root.id } });
      },
    });
    t.list.field('likes', {
      type: 'Like',
      resolve(root, _, ctx) {
        return ctx.db.like.findMany({ where: { userId: root.id } });
      },
    });
    t.list.field('comments', {
      type: 'Comment',
      resolve(root, _, ctx) {
        return ctx.db.comment.findMany({ where: { userId: root.id } });
      },
    });
    t.list.field('room', {
      type: 'Room',
      resolve(root, _, ctx) {
        return ctx.db.room.findMany({ where: { id: root.id }, include: { participant: true } });
      },
    });
    t.list.field('sendMessages', {
      type: 'Message',
    });
    t.list.field('receiveMessages', {
      type: 'Message',
    });
  },
});

//defined userById
schema.queryType({
  definition(t) {
    t.field('userById', {
      type: 'User',
      args: {
        id: schema.intArg({ required: true }),
      },
      resolve(_, args, ctx) {
        return ctx.db.user.findOne({ where: { id: args.id } });
      },
    });
    t.list.field('allUsers', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
  },
});
