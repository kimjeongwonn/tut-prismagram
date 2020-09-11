import { schema } from 'nexus';

//defined type
schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.email();
    t.model.firstName();
    t.model.lastName();
    t.model.bio();
    t.model.loginSecret();
    t.model.followers();
    t.model.followings();
    t.model.posts();
    t.model.likes();
    t.model.comments();
    t.model.rooms();
    t.model.sendMessages();
    t.model.receiveMessages();
  },
});

schema.objectType({
  name: 'AutoPayload',
  definition(t) {
    t.string('token');
    t.field('approvedUser', {
      type: 'User',
    });
  },
});
