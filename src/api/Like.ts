import { schema } from 'nexus';

schema.objectType({
  name: 'Like',
  definition(t) {
    t.id('id');
    t.id('userId');
    t.id('postId');
  },
});
