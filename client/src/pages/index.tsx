import React, { useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Typography, Popconfirm } from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import ReactPlayer from 'react-player/lazy';
import {
    useTracksQuery,
    useMeQuery,
    useVoteMutation,
    TrackSnippetFragment,
    useDeleteTrackMutation,
} from '../generated/graphql';
import '../styles/components/home.less';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Title } = Typography;
// const { Meta } = Card;

type VoteLoad = 'upvote-loading' | 'downvote-loading' | 'not-loading';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 8,
        cursor: null as null | string,
    });
    // console.log(variables);

    const [{ data, error, fetching }] = useTracksQuery({
        variables,
    });

    const [{ data: meData }] = useMeQuery();
    const trackCreator = meData?.me?.id;

    const [voteLoading, setVoteLoading] = useState<VoteLoad>('not-loading');
    const [, vote] = useVoteMutation();

    const [, deleteTrack] = useDeleteTrackMutation();

    if (!fetching && !data) {
        return (
            <div>
                <div>Une erreur est survenue dans la requête.</div>
                );
                <div>{error?.message}</div>
            </div>
        );
    }

    return (
        <div>
            <Title style={{ color: '#f3f5f9' }}>
                <span role="img" aria-label="fire">
                    🔥
                </span>{' '}
                Derniers partages
            </Title>
            <div className="home-track-container">
                {!data && fetching ? (
                    <Spin indicator={loadingIcon} />
                ) : (
                    data!.tracks.tracks.map((track: TrackSnippetFragment) =>
                        !track ? null : (
                            <Card
                                key={track.id}
                                // loading={voteLoading !== 'not-loading'}
                                // loading={fetching}
                                actions={[
                                    <ArrowUpOutlined
                                        key="upvote"
                                        style={{ color: track.voteStatus === 1 ? 'green' : undefined }}
                                        spin={voteLoading === 'upvote-loading'}
                                        onClick={async () => {
                                            if (track.voteStatus === 1) {
                                                return;
                                            }

                                            setVoteLoading('upvote-loading');
                                            await vote({
                                                value: 1,
                                                trackId: track.id,
                                            });
                                            setVoteLoading('not-loading');
                                        }}
                                    />,
                                    <div key="votes">{track.votes}</div>,
                                    <ArrowDownOutlined
                                        key="downvote"
                                        style={{ color: track.voteStatus === -1 ? '#e42a2d' : undefined }}
                                        spin={voteLoading === 'downvote-loading'}
                                        onClick={async () => {
                                            if (track.voteStatus === -1) {
                                                return;
                                            }

                                            setVoteLoading('downvote-loading');
                                            await vote({
                                                value: -1,
                                                trackId: track.id,
                                            });
                                            setVoteLoading('not-loading');
                                        }}
                                    />,
                                    <>
                                        {track.creator.id === trackCreator ? (
                                            <Link href="/track/edit/[id]" as={`/track/edit/${track.id}`}>
                                                <EditOutlined key="edit" />
                                            </Link>
                                        ) : (
                                            ''
                                        )}
                                    </>,
                                    <>
                                        {track.creator.id === trackCreator ? (
                                            <Popconfirm
                                                placement="top"
                                                title="Êtes-vous sûr de vouloir supprimer cette musique ?"
                                                onConfirm={async () => {
                                                    await deleteTrack({ id: track.id });
                                                }}
                                                okText="Supprimer"
                                                cancelText="Non"
                                            >
                                                <DeleteOutlined key="delete" />
                                            </Popconfirm>
                                        ) : null}
                                    </>,
                                    // <EditOutlined key="edit" />,
                                    // <DeleteOutlined key="delete" />,
                                ]}
                            >
                                <ReactPlayer url={track.url} width="100%" height="100%" controls />
                                <Link href="/track/[id]" as={`/track/${track.id}`}>
                                    <strong>{track.name}</strong>
                                </Link>
                                {/* <Meta description={`Ajouté par ${track.creator.username}`} /> */}
                            </Card>
                        ),
                    )
                )}
            </div>
            {data?.tracks.hasMore ? (
                <div className="load-more">
                    <Button
                        type="primary"
                        loading={fetching}
                        onClick={() => {
                            setVariables({
                                limit: variables.limit,
                                cursor: data.tracks.tracks[data.tracks.tracks.length - 1].createdAt,
                            });
                        }}
                    >
                        Voir plus
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
