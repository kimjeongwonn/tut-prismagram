import { schema } from 'nexus';

schema.objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.location();
    t.model.caption();
    t.model.files();
    t.model.likes();
    t.model.comments();
    t.model.user();
    t.model.userId();
  },
});

schema.objectType({
  name: 'File',
  definition(t) {
    t.id('id');
    t.string('url');
    t.id('postId');
  },
});

schema.objectType({
  name: 'Comment',
  definition(t) {
    t.id('id');
    t.string('text');
    t.id('userId');
    t.id('postId');
  },
});
