import { DeleteOutlined, EditOutlined, HeartOutlined, LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Result, Spin, Typography, Space } from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import { useDeleteTrackMutation } from '../../generated/graphql';
import '../../styles/components/track.less';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { getYouTubeId } from '../../utils/getYouTubeId';
import { useGetTrackFromUrl } from '../../utils/useGetTrackFromUrl';
import { useGetIntId } from '../../utils/useGetIntId';

const { Title } = Typography;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const fakeData = [
    {
        name: 'Jimi Hendrix - Purple Haze (Live at the Atlanta Pop Festival)',
        url: 'https://www.youtube.com/watch?v=cJunCsrhJjg',
    },
];

const Track = () => {
    const router = useRouter();
    const intId = useGetIntId();
    const [{ data, fetching, error }] = useGetTrackFromUrl();
    const [, deleteTrack] = useDeleteTrackMutation();

    // const [playingTrack, setPlayingTrack] = useState<string>();

    // useEffect(() =>
    // setPlayingTrack(data?.track?.url)
    // , [data, fetching]);

    const text = 'Êtes-vous sûr de vouloir supprimer cette musique ?';

    const columns = [
        {
            title: '',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="text">
                        <PlayCircleOutlined style={{ fontSize: '1.5rem' }} />
                    </Button>
                    <Button type="text">
                        <HeartOutlined style={{ fontSize: '1.5rem' }} />
                    </Button>
                </Space>
            ),
        },
        {
            title: 'Cover',
            dataIndex: 'url',
            render: (url: string) => (
                <img
                    className="table-cover"
                    alt={url}
                    src={data?.track?.url ? `https://img.youtube.com/vi/${getYouTubeId(data.track.url)}/0.jpg` : ''}
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
                        <div className="creator-info">
                            <p>Posté par{data.track.creator.username}.</p>
                        </div>
                        <div className="cta-actions">
                            <Space>
                                <NextLink href="/track/edit/[id]" as={`/track/edit/${intId}`}>
                                    <Button>
                                        <EditOutlined key="edit" />
                                    </Button>
                                </NextLink>
                                <Popconfirm
                                    placement="top"
                                    title={text}
                                    onConfirm={async () => {
                                        const { error: er } = await deleteTrack({ id: intId });
                                        if (!er) {
                                            router.push('/');
                                        }
                                    }}
                                    okText="Supprimer"
                                    cancelText="Non"
                                >
                                    <Button>
                                        <DeleteOutlined />
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </div>
                        {/* <div className="list">
                            <Title level={2}>Même artiste</Title>
                            <Table
                                columns={columns}
                                dataSource={fakeData}
                                pagination={{ pageSize: 10 }}
                                scroll={{ y: 240 }}
                            />
                        </div> */}
                    </div>
                </>
            )}
        </div>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Track);
