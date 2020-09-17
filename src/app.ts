import { use, settings, schema, server } from 'nexus';
import { authenticateJwt } from './passport';
import { prisma } from 'nexus-plugin-prisma';

settings.change({
  schema: {
    nullable: {
      outputs: false,
      inputs: false,
    },
  },
});
use(prisma());
schema.addToContext(({ req, res }) => {
  /// @ts-ignore
  const { user } = req;
  return {
    user,
    isAuthenticated: () => {
      if (!user) throw Error('로그인이 필요합니다!');
      return;
    },
  };
});
server.express.use(authenticateJwt); //1. 모든 Request시에 Header에 있는 토큰을 체크
