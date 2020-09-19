import { schema } from 'nexus';

schema.subscriptionType({
  definition(t) {
    t.field('newMessage', {
      type: 'Message',
      subscribe(_, root, ctx) {
        return ctx.pubsub.asyncIterator('NEW_MESSAGE');
      },
      resolve(event) {
        return event;
      },
    });
  },
});
