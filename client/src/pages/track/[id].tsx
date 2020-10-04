import { LoadingOutlined } from '@ant-design/icons';
import { Button, Result, Space, Spin, Table, Typography } from 'antd';
import { PlayCircleOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { useTrackQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { getYouTubeId } from '../../utils/getYouTubeId';
const { Title } = Typography;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
import '../../styles/components/track.less';

// interface Track {

// }

const fakeData = [
    {
        name: 'Jimi Hendrix - Purple Haze (Live at the Atlanta Pop Festival)',
        url: 'https://www.youtube.com/watch?v=cJunCsrhJjg',
    },
];

const Track = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{ data, fetching, error }] = useTrackQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });

    const columns = [
        {
            title: '',
            key: 'action',
            render: () => (
                <>
                    <Button type="text">
                        <PlayCircleOutlined
                            style={{ fontSize: '1.5rem' }}
                            // onClick={}
                        />
                    </Button>
                    <Button type="text">
                        <HeartOutlined
                            style={{ fontSize: '1.5rem' }}
                            // onClick={}
                        />
                    </Button>
                </>
            ),
        },
        {
            title: 'Cover',
            dataIndex: 'url',
            render: (url: string) => (
                <img
                    className="table-cover"
                    alt={url}
                    src={`https://img.youtube.com/vi/${getYouTubeId(data?.track?.url)}/0.jpg`}
                />
            ),
        },
        {
            title: 'Titre',
            dataIndex: 'name',
            key: 'title',
        },
    ];

    if (!fetching && !data) {
        return <div>Une erreur est survenue dans la requête.</div>;
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.track) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Oups, cette page n'existe pas."
                extra={
                    <Link href="/">
                        <Button type="primary">Accueil</Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div>
            {!data && fetching ? (
                <Spin indicator={loadingIcon} />
            ) : (
                <>
                    <Title style={{ color: '#f3f5f9' }}>{data.track.name}</Title>
                    <div className="track-container">
                        <div className="header">
                            <div className="player-wrapper">
                                <ReactPlayer
                                    className="react-wrapper"
                                    url={data.track.url}
                                    width="100%"
                                    height="100%"
                                    controls
                                />
                            </div>
                        </div>
                        <div className="list">
                            <Title level={2}>Même artiste</Title>
                            <Table
                                columns={columns}
                                dataSource={fakeData}
                                pagination={{ pageSize: 10 }}
                                scroll={{ y: 240 }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Track);
