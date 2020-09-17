import { schema } from 'nexus';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    // 메세지 보내기 <--
    t.field('SendMessage', {
      type: 'Message',
      args: {
        roomId: schema.intArg({ required: false }),
        toUserId: schema.idArg({ required: false }),
        text: schema.stringArg({ required: true }),
      },
      async resolve(_, { roomId: _roomId, toUserId, text }, ctx) {
        ctx.isAuthenticated();

        //자신에게 보내는지 확인
        if (toUserId === ctx.user.id) throw Error('자신에게 보낼 수 없습니다!');

        //roomId가 없을경우
        const createRoom = async () => {
          //toUserId도 없다면 입력값이 없으므로 에러출력
          if (toUserId) {
            //먼저 만들어진 방이 있는지 확인
            const [existingRoom] = await ctx.db.room.findMany({
              //participant에 나와 상대방만 있는 방을 찾음
              where: { participant: { every: { OR: [{ id: ctx.user.id }, { id: toUserId }] } } },
              select: { id: true },
            });
            //만약 있다면 그 방의 id를 리턴
            if (existingRoom) return existingRoom.id;
            //없다면 새로운 방을 만듦
            const newRoom = await ctx.db.room.create({
              data: { participant: { connect: [{ id: ctx.user.id }, { id: toUserId }] } },
              select: { id: true },
            });
            //새로만든 방의 id를 리턴
            return newRoom.id;
          } else throw new Error('입력값이 없습니다!');
        };

        //roomId 인자가 있는지 확인, 없다면 새로운 방을 만들거나 존재하는 방을 찾음
        const roomId = _roomId || (await createRoom());

        //roomId로 받은 방에 내가 존재하는지 확인
        const [isRoom] = await ctx.db.room.findMany({
          where: { id: roomId, participant: { some: { id: ctx.user.id } } },
        });

        //존재한다면 메세지 생성 후 연결, 없다면 에러 리턴
        if (isRoom) {
          return ctx.db.message.create({
            data: { room: { connect: { id: roomId } }, fromUser: { connect: { id: ctx.user.id } }, text },
          });
        } else throw Error('대화방에 참여하고 있지 않습니다!');
      },
    });
    // --> 메세지 보내기
  },
});
