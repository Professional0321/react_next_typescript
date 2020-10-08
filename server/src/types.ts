import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './utils/createUserLoader.ts';
import { createUpvoteLoader } from './utils/createUpvoteLoader.ts';

export type MyContext = {
    req: Request & { session: Express.Session };
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    upvoteLoader: ReturnType<typeof createUpvoteLoader>;
};
