//modules
import { use, settings, schema, server, log } from 'nexus';
import { authenticateJwt } from './passport';
import { prisma } from 'nexus-plugin-prisma';
import { createContext } from './context';

const websocketServer = server.express.settings.change({
  schema: {
    nullable: {
      outputs: false,
      inputs: false,
    },
  },
});

use(prisma());
schema.addToContext(createContext);

server.express.use(authenticateJwt); //1. 모든 Request시에 Header에 있는 토큰을 체크
