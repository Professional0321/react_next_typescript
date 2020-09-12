// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react';
import {
    Layout as LayoutAD,
} from 'antd';
import {
  Provider,
  createClient,
  dedupExchange,
  fetchExchange,
} from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';

import {
  MeDocument,
  LoginMutation,
  MeQuery,
  RegisterMutation,
  LogoutMutation,
} from '../generated/graphql';

import { TopNavBar } from '../components/TopNavBar';
import { NavBar } from '../components/NavBar';
import '../styles/index.less';

const {
  Header,
  Content,
  // Footer,
  Sider,
} = LayoutAD;

function cachingUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
    fetchExchange,
  ],
});


function MyApp({ Component, pageProps }: AppProps) {
        return (
          <Provider value={client}>
            <LayoutAD style={{ minHeight: '100vh', overflow: 'auto' }}>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={broken => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
            >
              {/* <div className="logo" /> */}
              <div className="logo" style={{color: 'white', fontSize: '2rem', textAlign: 'center' }}>Dylt</div>
                {/* Left NavBar component */}
              <NavBar />
            </Sider>
            <LayoutAD>
              <Header className="site-layout-sub-header-background">
                {/* Login/Logout component */}
                <TopNavBar />
              </Header>
              <Content style={{ margin: '24px 16px 0' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Component {...pageProps} />
                </div>
              </Content>
              {/* <Footer style={{ textAlign: 'center' }}>Dylt ©2020. Quentin Brohan</Footer> */}
            </LayoutAD>
          </LayoutAD>
          </Provider>
        );
};

export default MyApp;