import { Resolver, Query } from 'type-graphql';

@Resolver()
export class HellResolver {
    @Query(() => String)
    hello() {
        return 'Hell-O World'
    }
};