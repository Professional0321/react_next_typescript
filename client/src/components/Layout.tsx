import React from 'react';
import { Layout as LayoutAD, Menu } from 'antd';
import { HomeFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = LayoutAD;

interface LayoutProps {

}

const Layout: React.FC<LayoutProps> = ({ children }) => {
        return (
            <Layout>
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
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1" icon={<HomeFilled />}>
                  Accueil
                  
                </Menu.Item>
                <Menu.Item key="2" icon={<SearchOutlined />}>
                  Explorer
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined />}>
                  Mon profil
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
              <Content style={{ margin: '24px 16px 0' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                  {children}
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Dylt ©2020 Created by Quentin Brohan</Footer>
            </Layout>
          </Layout>
        );
}

export default Layout;