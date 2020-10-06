// import App from "next/app";
import { Layout as LayoutAD } from 'antd';
import { withUrqlClient } from 'next-urql';
import type { AppProps /* , AppContext */ } from 'next/app';
import React from 'react';
import { NavBar } from '../components/NavBar';
import { TopNavBar } from '../components/TopNavBar';
import '../styles/index.less';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Header, Content, Sider } = LayoutAD;

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <LayoutAD style={{ minHeight: '100vh', overflow: 'auto' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                {/* <div className="logo" /> */}
                <div className="logo" style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>
                    Dylt
                </div>
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
                        {/* Page */}
                        <Component {...pageProps} />
                    </div>
                </Content>
            </LayoutAD>
        </LayoutAD>
    );
}

export default withUrqlClient(createUrqlClient)(MyApp);
