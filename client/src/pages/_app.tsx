// import App from "next/app";
import { Layout as LayoutAD } from 'antd';
import { withUrqlClient } from 'next-urql';
import type { AppProps /* , AppContext */ } from 'next/app';
import React from 'react';
import '../styles/index.less';
import { createUrqlClient } from '../utils/createUrqlClient';
import SiteLayout from '../components/Layout';

const { Header, Content, Sider } = LayoutAD;

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SiteLayout>
            <Component {...pageProps} />
        </SiteLayout>
    );
}

export default withUrqlClient(createUrqlClient)(MyApp);
