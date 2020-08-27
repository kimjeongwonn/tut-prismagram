require('dotenv').config();
import { GraphQLServer } from 'graphql-yoga';
import morgan from 'morgan';
import schema from './schema';

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({ schema });

server.express.use(morgan('dev'));

server.start({ port: PORT }, () => console.log(`Server running on port ${PORT}`));
