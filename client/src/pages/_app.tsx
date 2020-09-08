// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react';
import {
    Layout as LayoutAD,
    Menu,
} from 'antd';
import { HomeFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Provider, createClient } from 'urql';
import Link from 'next/link';

import { TopNavBar } from '../components/TopNavBar';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
});

const { Header, Content, Footer, Sider } = LayoutAD;

import '../styles/components/layout.less';


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
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<HomeFilled />}>
                  <Link href="/">
                    Accueil
                  </Link>
                  
                </Menu.Item>
                <Menu.Item key="2" icon={<SearchOutlined />}>
                <Link href="/explore">
                    Explorer
                  </Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                <Link href="/profile">
                    Mon profil
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <LayoutAD>
              <Header className="site-layout-sub-header-background">
                <TopNavBar />
              </Header>
              <Content style={{ margin: '24px 16px 0' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Component {...pageProps} />
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Dylt ©2020. Quentin Brohan</Footer>
            </LayoutAD>
          </LayoutAD>
          </Provider>
        );
};

export default MyApp;