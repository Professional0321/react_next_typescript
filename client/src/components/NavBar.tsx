import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import {
    HomeFilled,
    SearchOutlined,
    UserOutlined,
    PlusCircleOutlined,
    BarsOutlined,
} from '@ant-design/icons';
import { useMeQuery } from '../generated/graphql';

export const NavBar = () => {
    const [{ data, fetching }] = useMeQuery();
    let body = null;

    // Data is loading
    if (fetching) {
        // User not logged in
    } else if (!data?.me) {
        body = (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<HomeFilled />}>
                    <Link href="/">Accueil</Link>
                </Menu.Item>
            </Menu>
        );
        // User is logged in
    } else {
        body = (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<HomeFilled />}>
                    <Link href="/">Accueil</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<SearchOutlined />}>
                    <Link href="/explore">Explorer</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<PlusCircleOutlined />}>
                    <Link href="/create-track">Ajouter une musique</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<BarsOutlined />}>
                    <Link href="/playlists">Playlists</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UserOutlined />}>
                    <Link href="/profile">Mon profil</Link>
                </Menu.Item>
            </Menu>
        );
    }

    return <>{body}</>;
};
