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
schema.addToContext(({ req, res }) => {
  const { user } = req;
  return {
    user,
    isAuthenticated: () => {
      if (!user) throw new Error('You need to log in to perform this action');
      return;
    },
  };
});
use(prisma());
server.express.use(authenticateJwt); //1. 모든 Request시에 Header에 있는 토큰을 체크
