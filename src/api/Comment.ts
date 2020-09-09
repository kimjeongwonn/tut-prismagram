import { schema } from 'nexus';

schema.objectType({
  name: 'Comment',
  definition(t) {
    t.id('id');
    t.string('text');
    t.id('userId');
    t.id('postId');
  },
});
