import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './utils/createUserLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';

export type MyContext = {
    req: Request & { session: Express.Session };
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    upvoteLoader: ReturnType<typeof createUpvoteLoader>;
};
