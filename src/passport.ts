import passport from 'passport';
import express from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient, User } from '@prisma/client';
require('dotenv').config();
const prisma = new PrismaClient();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

//4. header에서 넘어온 토큰을 해석한 뒤 payload의 내용을 받아서 done콜백함수를 실행한다.
const verifyUser = async (payload: any, done: any) => {
  //try로 감싸주어 error 발생시 바로 err를 담아서 done 함수를 호출
  try {
    //payload의 내용을 검사 (id를 받음)
    const user = await prisma.user.findOne({ where: { id: payload.id } });
    //만약 DB에 payload에서 받은 id가 있다면 받은 user객체를 done 함수를 통해 반환
    if (user !== null) {
      return done(null, user);
    } else {
      //만약 DB에 id가 없다면 false를 반환
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
};

export interface ExpressMiddleware {
  (req: express.Request, res: express.Response, next: express.NextFunction): void;
}

//2. 미들웨어로 실행되는 passport인증
export const authenticateJwt: ExpressMiddleware = (req, res, next) =>
  //3. header에 있는 jwt토큰을 passportjs를 통해 해석 후 verifyUser를 사용하여 인증
  //5. verifyUser의 done콜백함수를 통해 받은 인자를 req.user에 담아는 미들웨어 함수를 반환해줌
  //passport.authenticate 함수는 콜백이 있는 middlewere 함수를 반환한다. 그렇기 app.use를 통해 받은 인자를 바로 전달해 줘야 작동함.
  passport.authenticate('jwt', { session: false }, (error, user: User) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new JwtStrategy(jwtOptions, verifyUser));
passport.initialize();
