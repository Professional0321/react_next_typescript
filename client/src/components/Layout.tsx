import { Layout } from 'antd';
import React from 'react';
import { ISiteLayout } from '../interfaces';
import '../styles/index.less';
import NavBar from './NavBar';
import TopNavBar from './TopNavBar';

const { Header, Content, Sider } = Layout;

const SiteLayout: React.FC<ISiteLayout> = ({ children }: ISiteLayout) => {
    return (
        <Layout style={{ minHeight: '100vh', overflow: 'auto' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    // console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    // console.log(collapsed, type);
                }}
            >
                {/* <div className="logo" /> */}
                <div className="logo" style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>
                    Dylt
                </div>
                {/* Left NavBar component */}
                <NavBar />
            </Sider>
            <Layout>
                <Header className="site-layout-sub-header-background">
                    {/* Login/Logout/Register component */}
                    <TopNavBar />
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        {/* Page */}
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default SiteLayout;
