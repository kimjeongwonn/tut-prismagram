import { GraphQLServer } from 'graphql-yoga';
import { makeSchema } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import { createContext } from './context';
import { authenticateJwt } from './passport';
import * as types from './api';

const PORT = 3000;

const schema = makeSchema({
  types,
  plugins: [nexusSchemaPrisma()],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'ctx.Context',
    sources: [
      {
        source: require.resolve('./context'),
        alias: 'ctx',
      },
    ],
  },
});
const server = new GraphQLServer({
  schema,
  context: ({ request }) => createContext(request),
});

server.express.use(authenticateJwt);
server.start(
  {
    port: PORT,
  },
  () => console.log(`http://localhost:${PORT}에서 서버 작동중`)
);
