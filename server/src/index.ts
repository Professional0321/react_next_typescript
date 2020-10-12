import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import path from 'path';
import { Track } from './entities/Track';
import { User } from './entities/User';
import { UserResolver } from './resolvers/user';
import { TrackResolver } from './resolvers/track';
import { __prod__, COOKIE_NAME } from './constants';
import { Upvote } from './entities/Upvote';
import { createUserLoader } from './utils/createUserLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';
import 'dotenv-safe/config';

const main = async () => {
    const connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [Track, User, Upvote],
    });

    await connection.runMigrations();

    // await Track.delete({});

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    // Proxy env / Nginx
    app.set('proxy', 1);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        }),
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
                httpOnly: true,
                sameSite: 'lax', // CSRF
                secure: __prod__, // cookie only works in https
                domain: __prod__ ? 'ec2-54-234-61-225.compute-1.amazonaws.com' : undefined, // Cookie domain
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        }),
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [TrackResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            upvoteLoader: createUpvoteLoader(),
        }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(parseInt(process.env.PORT), () => {
        console.log(`Server started on localhost:${process.env.PORT}`);
    });
};

main().catch((error) => {
    console.log(error);
});
