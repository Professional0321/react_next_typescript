import { Layout } from 'antd';
import React, { useContext } from 'react';
import { AppContext } from '../context/context';
import { ISiteLayout } from '../interfaces';
import '../styles/index.less';
import Menu from './Menu';
import Player from './Player';
import TopNavBar from './TopNavBar';


const { Header, Content, Sider } = Layout;

const SiteLayout: React.FC<ISiteLayout> = ({ children }: ISiteLayout) => {
    const { state, dispatch } = useContext(AppContext);

    return (
        <Layout style={{ minHeight: '100vh', overflow: 'auto' }}>
            {state.player.isOpen && <Player />}
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
                {/* Left Menu component */}
                <Menu />
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
