import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import ReactPlayer from 'react-player/lazy';
import { useTracksQuery, useMeQuery, useVoteMutation, TrackSnippetFragment } from '../generated/graphql';
import '../styles/components/home.less';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useState } from 'react';

const { Title } = Typography;
// const { Meta } = Card;

type voteLoad = 'upvote-loading' | 'downvote-loading' | 'not-loading';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 8,
        cursor: null as null | string,
    });
    // console.log(variables);

    const [{ data, fetching }] = useTracksQuery({
        variables,
    });

    const [{ data: meData }] = useMeQuery();
    const trackCreator = meData?.me?.username;

    const [voteLoading, setVoteLoading] = useState<voteLoad>('not-loading');
    const [, vote] = useVoteMutation();

    if (!fetching && !data) {
        return <div>Une erreur est survenue dans la requête.</div>;
    }

    return (
        <div>
            <Title style={{ color: '#f3f5f9' }}>🔥 Derniers partages</Title>
            <div className="home-track-container">
                {!data && fetching ? (
                    <Spin indicator={loadingIcon} />
                ) : (
                    data!.tracks.tracks.map((track: TrackSnippetFragment) => (
                        <Card
                            key={track.id}
                            // loading={voteLoading !== 'not-loading'}
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
                                <div>{track.votes}</div>,
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
                                <>{track.creator.username === trackCreator ? <EditOutlined key="edit" /> : ''}</>,
                                <>{track.creator.username === trackCreator ? <DeleteOutlined key="delete" /> : ''}</>,
                                // <EditOutlined key="edit" />,
                                // <DeleteOutlined key="delete" />,
                            ]}
                        >
                            <ReactPlayer
                                url={track.url}
                                width="100%"
                                height="100%"
                                controls
                                // light
                            />
                            <Link href="/track/[id]" as={`/track/${track.id}`}>
                                <a>
                                    <strong>{track.name}</strong>
                                </a>
                            </Link>
                            {/* <Meta description={`Ajouté par ${track.creator.username}`} /> */}
                        </Card>
                    ))
                )}
            </div>
            {data && data.tracks.hasMore && (
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
            )}
        </div>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
