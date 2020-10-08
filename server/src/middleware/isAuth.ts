import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';

// Check if user is connected
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error('Non authentifié.');
    }

    return next();
};
