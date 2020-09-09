// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react';
import {
    Layout as LayoutAD,
} from 'antd';
import { Provider, createClient } from 'urql';

import { TopNavBar } from '../components/TopNavBar';
import { NavBar } from '../components/NavBar';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
});

const {
  Header,
  Content,
  // Footer,
  Sider,
} = LayoutAD;

import '../styles/index.less';


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