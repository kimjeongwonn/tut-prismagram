import { schema } from 'nexus';

schema.objectType({
  name: 'File',
  definition(t) {
    t.id('id');
    t.string('url');
    t.id('postId');
  },
});
