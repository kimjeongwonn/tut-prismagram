import { PubSub } from 'graphql-subscriptions';
import { prisma } from 'prisma/client';

const pubsub = new PubSub();

export const createContext = ({ req, res }: ContextAdderLens) => {
  //@ts-ignore
  const { user } = req;
  return {
    pubsub,
    user,
    isAuthenticated: () => {
      if (!user) throw Error('로그인이 필요합니다!');
      return;
    },
  };
};
