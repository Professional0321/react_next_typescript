import React, { useState, useContext } from 'react';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    PlayCircleOutlined,
    // PauseCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Spin, Typography, Popconfirm } from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import {
    useTracksQuery,
    useMeQuery,
    useVoteMutation,
    useDeleteTrackMutation,
    Track,
    TrackSnippetFragment,
} from '../generated/graphql';
import '../styles/components/home.less';
import { createUrqlClient } from '../utils/createUrqlClient';
import { getYouTubeId } from '../utils/getYouTubeId';
import Player from '../components/Player';
import { AppContext } from '../context/context';
import { TypesPlayer, TypesTrack } from '../reducers/reducers';


const { Title } = Typography;
// const { Meta } = Card;

type VoteLoad = 'upvote-loading' | 'downvote-loading' | 'not-loading';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index: React.FC = () => {
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

    // Context
    const { state, dispatch } = useContext(AppContext);


    const handleTrack = (track: Track) => {
        dispatch({
            type: TypesTrack.SaveTrack,
            payload: track,
        })
    };

    if (!fetching && !data) {
        return (
            <div>
                <div>Une erreur est survenue dans la requête.</div>
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
                                <div className="video-thumbnail">
                                    <div className="player-actions">
                                        <Button type="text">
                                            <PlayCircleOutlined
                                                onClick={() => {
                                                    if (!state.player.isOpen) {
                                                        dispatch({
                                                            type: TypesPlayer.OpenClosePlayer,
                                                        });
                                                        handleTrack(track);
                                                    }
                                                    handleTrack(track);
                                                    if (!state.player.playing) {
                                                        dispatch({
                                                            type: TypesPlayer.Play,
                                                        });
                                                    };
                                                }}
                                            />
                                        </Button>
                                        {/* <Button type="text">
                                                <PauseCircleOutlined
                                                    onClick={() => {
                                                        setPlaying(false);
                                                    }}
                                                />
                                            </Button> */}
                                    </div>
                                    <img
                                        src={`https://img.youtube.com/vi/${getYouTubeId(track.url)}/0.jpg`}
                                        alt={track.url}
                                        className="video-thumbnail-image"
                                    />
                                </div>
                                <Link href="/track/[id]" as={`/track/${track.id}`}>
                                    <a>
                                        <strong>{track.name}</strong>
                                    </a>
                                </Link>
                                {/* <Meta description={`Ajouté par ${track.creator.username}`} /> */}
                            </Card>
                        ),
                    )
                )}
            </div>
            {/* {state.player.isOpen && <Player />} */}
            {data?.tracks.hasMore ? (
                <div className="load-more" style={{ paddingBottom: state.player.isOpen ? '4rem' : '' }}>
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
