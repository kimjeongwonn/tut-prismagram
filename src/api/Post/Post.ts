import { schema } from 'nexus';

schema.objectType({
  name: 'Post',
  definition(t) {
    t.id('id');
    t.string('location', { nullable: true });
    t.string('caption', { nullable: true });
    t.list.field('files', {
      type: 'File',
    });
    t.list.field('likes', {
      type: 'Like',
    });
    t.list.field('comments', {
      type: 'Comment',
    });
    t.id('userId');
  },
});
