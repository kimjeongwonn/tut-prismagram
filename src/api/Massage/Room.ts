import { schema } from 'nexus';
import { resolve } from 'path';

schema.objectType({
  name: 'Room',
  definition(t) {
    t.id('id');
    t.list.field('participant', {
      type: 'User',
      resolve(root, _, ctx) {
        return ctx.db.user.findMany();
      },
    });
    t.list.field('messages', { type: 'Message' });
  },
});
