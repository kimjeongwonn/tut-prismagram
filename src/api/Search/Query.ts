import * as schema from '@nexus/schema';

export const SearchQuery = schema.extendType({
  type: 'Query',
  definition(t) {
    //사용자 검색하기 <--
    t.list.field('searchUsers', {
      type: 'User',
      args: {
        keyword: schema.stringArg({ required: true }),
      },
      resolve(_, args, ctx) {
        const { keyword } = args;
        const result = ctx.prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: keyword } },
              { lastName: { contains: keyword } },
              { firstName: { contains: keyword } },
            ],
          },
        });
        return result;
      },
    });
    //--> 사용자 검색하기
    //게시물 검색하기 -->
    t.list.field('searchPost', {
      type: 'Post',
      args: {
        keyword: schema.stringArg({ required: true }),
      },
      async resolve(_, { keyword }, ctx) {
        const result = ctx.prisma.post.findMany({
          where: {
            OR: [
              { caption: { contains: keyword } },
              { location: { contains: keyword } },
              { user: { username: { contains: keyword } } },
            ],
          },
        });
        return result;
      },
    });
    //--> 게시물 검색하기
  },
});
