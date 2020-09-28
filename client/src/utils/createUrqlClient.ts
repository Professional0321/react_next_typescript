import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { cachingUpdateQuery } from "./cachingUpdateQuery";
import Router from "next/router";

const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('Non authentifié.')) {
        Router.replace('/login');
      }
    })
  );
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
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'tracks',
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string[];
      const data = cache.resolve(key, 'tracks') as string[];
      const _hasMore = cache.resolve(key,'hasMore');
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

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
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
          createTrack: (_result, args, cache, info) => {
            const allFields = cache.inspectFields('Query');
            // console.log("allFields: ", allFields);
            const fieldInfos = allFields.filter((info) => info.fieldName === 'tracks');
            fieldInfos.forEach((field) => {
              cache.invalidate('Query', 'tracks', field.arguments || {})
            });
          },
          logout: (_result, args, cache, info) => {
            cachingUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
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
              }
            );
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
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
