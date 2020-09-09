import { schema } from 'nexus';

schema.objectType({
  name: 'Message',
  definition(t) {
    t.id('id');
    t.string('text');
    t.id('fromUserId');
    t.id('toUserId');
    t.id('roomId');
    t.field('timeStamp', { type: 'DateTime' });
  },
});
