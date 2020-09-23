import * as schema from '@nexus/schema';
import { withFilter } from 'graphql-yoga';

export const MessageSubscription = schema.subscriptionType({
  definition(t) {
    t.field('newMessage', {
      type: 'Message',
      args: {
        roomId: schema.intArg({ required: true }),
      },
      subscribe: withFilter(
        (_, __, ctx) => ctx.pubsub.asyncIterator('NEW_MESSAGE'),
        (root, args, _) => root.room.id === args.roomId
      ),
      resolve(payload, _, __) {
        return payload;
      },
    });
  },
});
