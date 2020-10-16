import {
    DeleteOutlined,
    EditOutlined,
    HeartOutlined,
    LoadingOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Spin, Table, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import {
    Track as TrackProps,
    useDeleteTrackMutation,
    useTrackByIdAndSameArtistTracksQuery,
} from '../../generated/graphql';
import '../../styles/components/track.less';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { getYouTubeId } from '../../utils/getYouTubeId';
import { secondsToTime } from '../../utils/secondsToTime';
import { useGetIntId } from '../../utils/useGetIntId';
import Player from '../../components/Player';

const { Title } = Typography;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Track = () => {
    const router = useRouter();
    const intId = useGetIntId();
    const [{ data, fetching, error }] = useTrackByIdAndSameArtistTracksQuery({
        variables: {
            id: intId,
        },
    });

    // Mutations
    const [, deleteTrack] = useDeleteTrackMutation();
    // Delete Popover
    const text = 'Êtes-vous sûr de vouloir supprimer cette musique ?';

    // Player
    // const ref = useRef();
    const [openPlayer, setOpenPlayer] = useState<boolean>(false);
    const [track, setTrack] = useState<TrackProps | null>(null);

    const handleTrack = (track: TrackProps) => {
        setTrack(track);
    };

    // List
    const columns = [
        {
            title: '',
            key: 'action',
            render: (track: TrackProps) => (
                <Space>
                    <Button type="text">
                        <PlayCircleOutlined
                            style={{ fontSize: '1.5rem' }}
                            onClick={() => {
                                if (!openPlayer) {
                                    setOpenPlayer(true);
                                } else if (track.id !== data?.trackByIdAndSameArtistTracks.track.id) {
                                    handleTrack(track);
                                }
                            }}
                        />
                    </Button>
                    {/* <Button type="text">
                                        <PauseCircleOutlined
                                            style={{ fontSize: '1.5rem' }}
                                            // onClick={() => {
                                            // }}
                                        />
                                    </Button> */}
                    <Button type="text">
                        <HeartOutlined style={{ fontSize: '1.5rem', color: '#606060' }} />
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
                    src={data ? `https://img.youtube.com/vi/${getYouTubeId(url)}/0.jpg` : ''}
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

    return (
        <div>
            {!data && fetching ? (
                <Spin indicator={loadingIcon} />
            ) : (
                <>
                    <Title style={{ color: '#f3f5f9' }}>
                        <Button type="text">
                            <PlayCircleOutlined
                                style={{ fontSize: '2rem' }}
                                onClick={() => {
                                    if (!openPlayer) {
                                        setOpenPlayer(true);
                                    }
                                    handleTrack(data?.trackByIdAndSameArtistTracks.track);
                                }}
                            />
                        </Button>
                        {data?.trackByIdAndSameArtistTracks.track.name}
                    </Title>
                    <div className="track-container">
                        <div className="header" />
                        <div className="creator-info">
                            <p>Posté par {data?.trackByIdAndSameArtistTracks.track.creator.username}.</p>
                        </div>
                        <div className="cta-actions">
                            <Space>
                                <Link href="/track/edit/[id]" as={`/track/edit/${intId}`}>
                                    <Button>
                                        <EditOutlined key="edit" />
                                    </Button>
                                </Link>
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
                        {openPlayer && (
                            <Player
                                track={track || data?.trackByIdAndSameArtistTracks.track}
                                tracks={data?.trackByIdAndSameArtistTracks.tracks}
                            />
                        )}
                        {data && (
                            <div className="list">
                                <Title level={2}>Même artiste</Title>
                                <Table
                                    columns={columns}
                                    dataSource={data.trackByIdAndSameArtistTracks.tracks}
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ y: 240 }}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Track);
