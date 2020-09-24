import 'reflect-metadata';
import { __prod__, COOKIE_NAME } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { TrackResolver } from './resolvers/track';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Track } from './entities/Track';
import { User } from './entities/User';

const main = async () => {
    const connection = await createConnection({
        type: 'postgres',
        database: 'dylt2',
        username: 'etudiant',
        password: 'postgres',
        logging: true,
        synchronize: true,
        entities: [Track, User],
    });

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        },
    ));

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
            secure: __prod__ // cookie only works in https
        },
        saveUninitialized: false,
        secret: 'Sh3naN/g*ns2899',
        resave: false,
    })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, TrackResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    })
};

main().catch((error) => {
    console.log(error)
});