import { schema } from 'nexus';

schema.objectType({
  name: 'Message',
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.fromUserId();
    t.model.toUserId();
    t.model.roomId();
    t.model.timeStamp();
  },
});

schema.objectType({
  name: 'Room',
  definition(t) {
    t.model.id();
    t.model.participant();
    t.model.messages();
  },
});
