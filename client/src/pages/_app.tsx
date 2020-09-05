// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react';
import {
    Layout as LayoutAD,
    Menu,
    Button,
    Space,
} from 'antd';
import { HomeFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Provider, createClient} from 'urql';

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
                  Accueil
                  
                </Menu.Item>
                <Menu.Item key="2" icon={<SearchOutlined />}>
                  Explorer
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                  Mon profil
                </Menu.Item>
              </Menu>
            </Sider>
            <LayoutAD>
              <Header className="site-layout-sub-header-background">
                  <Space>
                  <Button>Inscription</Button>
                  <Button type="primary">Connexion</Button>
                  </Space>
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
}

export default MyApp;