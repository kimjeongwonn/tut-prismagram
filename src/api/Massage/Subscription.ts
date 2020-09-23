import * as schema from '@nexus/schema';

export const MessageSubscription = schema.subscriptionType({
  definition(t) {
    t.field('newMessage', {
      type: 'Message',
      subscribe(_, __, ctx) {
        return ctx.pubsub.asyncIterator('NEW_MESSAGE');
      },
      resolve(payload, _, __) {
        return payload;
      },
    });
  },
});
