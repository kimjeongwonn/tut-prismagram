import { PrismaClient, User } from '@prisma/client';
import { PubSub } from 'graphql-yoga';

const pubsub = new PubSub();
const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  pubsub: PubSub;
  req: any;
  isAuthenticated: () => void;
}

export function createContext(req: Express.Request): Context {
  function isAuthenticated() {
    if (!req.user) throw new Error('로그인이 필요합니다!');
  }
  return { prisma, pubsub, isAuthenticated, req };
}
