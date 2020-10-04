import { cacheExchange, Resolver, Cache } from '@urql/exchange-graphcache';
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import { pipe, tap } from 'wonka';
import {
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
    VoteMutationVariables,
    DeleteTrackMutationVariables,
} from '../generated/graphql';
import { cachingUpdateQuery } from './cachingUpdateQuery';
import Router from 'next/router';
import gql from 'graphql-tag';
import { isServer } from './isServer';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes('Non authentifié.')) {
                Router.replace('/login');
            }
        }),
    );
};

const invalidateAllTracks = (cache: Cache) => {
    const allFields = cache.inspectFields('Query');
    const fieldInfos = allFields.filter((info) => info.fieldName === 'tracks');
    fieldInfos.forEach((field) => {
        cache.invalidate('Query', 'tracks', field.arguments || {});
    });
};

// Cursor Pagination
// https://github.com/FormidableLabs/urql/blob/main/exchanges/graphcache/src/extras/simplePagination.ts
const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        // console.log(entityKey, fieldName);
        const allFields = cache.inspectFields(entityKey);
        // console.log("allFields: ", allFields);
        const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInTheCache = cache.resolve(cache.resolveFieldByKey(entityKey, fieldKey) as string, 'tracks');
        info.partial = !isItInTheCache;
        let hasMore = true;
        const results: string[] = [];
        fieldInfos.forEach((fi) => {
            const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string[];
            const data = cache.resolve(key, 'tracks') as string[];
            const _hasMore = cache.resolve(key, 'hasMore');
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            // console.log('data: ', hasMore, data);
            results.push(...data);
        });

        return {
            __typename: 'PaginatedTracks',
            hasMore: true,
            tracks: results,
        };
    };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = '';
    // console.log('ctx req: ', ctx.req.headers.cookie);
    if (isServer()) {
        cookie = (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || '';
    }

    return {
        url: 'http://localhost:4000/graphql',
        fetchOptions: {
            credentials: 'include' as const,
            // headers: (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || '',
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                keys: {
                    PaginatedTracks: () => null,
                },
                resolvers: {
                    Query: {
                        tracks: cursorPagination(),
                    },
                },
                updates: {
                    Mutation: {
                        deleteTrack: (_result, args, cache, info) => {
                            cache.invalidate({
                                __typename: 'Track',
                                id: (args as DeleteTrackMutationVariables).id,
                            });
                        },
                        vote: (_result, args, cache, info) => {
                            const { trackId, value } = args as VoteMutationVariables;
                            const data = cache.readFragment(
                                gql`
                                    fragment _ on Track {
                                        id
                                        votes
                                        voteStatus
                                    }
                                `,
                                { id: trackId } as any,
                            );
                            // console.log('data :', data)
                            if (data) {
                                if (data.voteStatus === value) {
                                    return;
                                }

                                const newVotes = (data.votes as number) + (!data.voteStatus ? 1 : 2) * value;
                                cache.writeFragment(
                                    gql`
                                        fragment __ on Track {
                                            votes
                                            voteStatus
                                        }
                                    `,
                                    {
                                        id: trackId,
                                        votes: newVotes,
                                        voteStatus: value,
                                    } as any,
                                );
                            }
                        },
                        createTrack: (_result, args, cache, info) => {
                            invalidateAllTracks(cache);
                        },
                        logout: (_result, args, cache, info) => {
                            cachingUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, () => ({
                                me: null,
                            }));
                        },
                        login: (_result, args, cache, info) => {
                            cachingUpdateQuery<LoginMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.login.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.login.user,
                                        };
                                    }
                                },
                            );
                            invalidateAllTracks(cache);
                        },
                        register: (_result, args, cache, info) => {
                            cachingUpdateQuery<RegisterMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.register.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.register.user,
                                        };
                                    }
                                },
                            );
                        },
                    },
                },
            }),
            errorExchange,
            ssrExchange,
            fetchExchange,
        ],
    };
};
