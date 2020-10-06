import React from 'react';
import { Button, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

export const TopNavBar = () => {
    const router = useRouter();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    let body = null;

    // Data is loading
    if (fetching) {
        // User not logged in
    } else if (!data?.me) {
        body = (
            <Space>
                <Link href="/register">
                    <Button>Inscription</Button>
                </Link>
                <Link href="/login">
                    <Button type="primary">Connexion</Button>
                </Link>
            </Space>
        );
        // User is logged in
    } else {
        body = (
            <Space>
                <div>{data.me.username}</div>
                <Button
                    type="primary"
                    onClick={async () => {
                        await logout();
                        router.reload();
                    }}
                    loading={logoutFetching}
                >
                    Déconnexion
                </Button>
            </Space>
        );
    }

    return <>{body}</>;
};
