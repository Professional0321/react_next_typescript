import {
    BackwardOutlined,
    CaretRightOutlined,
    ForwardOutlined,
    PauseOutlined,
    RetweetOutlined,
    SoundOutlined,
    HeartOutlined,
    // HeartFilled,
} from '@ant-design/icons';
import { Slider } from 'antd';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { ReactPlayerProps } from 'react-player/lazy';
import { Track } from '../generated/graphql';
import '../styles/components/player.less';
import { getYouTubeId } from '../utils/getYouTubeId';
import { secondsToTime } from '../utils/secondsToTime';

type PlayerProps = {
    track: Track;
    tracks: Array<Track>;
    playing: boolean;
};

type ProgressProps = {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
};

// TODO: Transform to HOC
const Player: React.FC<PlayerProps> = ({ track, tracks }) => {
    // console.log('track: ', track);
    // console.log('tracks: ', tracks);
    const ref = useRef();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [state, setState] = useState<ReactPlayerProps>({
        url: null,
        name: null,
        playing: false,
        volume: 1,
        seeking: true,
        played: 0,
        playedSeconds: 0,
        loaded: 0,
        duration: 0,
        loop: false,
    });
    useEffect(
        () =>
            setState({
                ...state,
                url: track.url,
                name: track.name,
                playing: true,
                seeking: false,
            }),
            // TODO: if tracks state.url => [track.url, tracks.url]
        [track, tracks],
    );

    // ReactPlayer Functions
    const handlePlayPause = () => {
        setState({ ...state, playing: !state.playing });
    };
    const handlePlay = () => {
        setState({ ...state, playing: true });
    };
    const handlePause = () => {
        setState({ ...state, playing: false });
    };
    const toggleLoop = () => {
        setState({ ...state, loop: !state.loop });
    };
    const handleVolumeChange = (value: number) => {
        setState({ ...state, volume: value });
    };
    //
    const handleSeekChange = (value: number) => {
        setState({ ...state, played: value });
    };
    const handleSeekMouseUp = (value: number) => {
        setState({ ...state, seeking: false });
        if (ref) {
            ref.current.seekTo(value);
        }
    };
    //
    const handleProgress = (progress: ProgressProps) => {
        // console.log('onProgress', progress);
        // Update only time slider if not seeking
        if (!state.seeking) {
            setState({
                ...state,
                played: progress.played,
                playedSeconds: progress.playedSeconds,
            });
        }
    };

    const handleDuration = (duration: number) => {
        // console.log('onDuration', duration);
        setState({ ...state, duration });
    };

    const formatter = (value?: number | undefined) => {
        return `${value * 100}%`;
    };

    return (
        <div className="video-wrapper">
            <div className="video">
                <div className="video__slider">
                    {/* Slider */}
                    <Slider
                        min={0}
                        max={0.999999}
                        step={0.01}
                        tipFormatter={null}
                        value={state.played}
                        onChange={handleSeekChange}
                        onAfterChange={handleSeekMouseUp}
                    />
                </div>
                <div className="video__preview">
                    <div className="video__player">
                        <div className="video-player">
                            {/* Iframe */}
                            <ReactPlayer
                                ref={ref}
                                url={state.url}
                                width="0px"
                                height="0px"
                                playing={state.playing}
                                loop={state.loop}
                                volume={state.volume}
                                onPlay={handlePlay}
                                onPause={handlePause}
                                onProgress={handleProgress}
                                onDuration={handleDuration}
                                onReady={() => setIsReady(true)}
                            />
                            <div className="video__player-thumbnail">
                                <img
                                    src={
                                        state.url?.length > 1
                                            ? `https://img.youtube.com/vi/${getYouTubeId(state.url)}/0.jpg`
                                            : ''
                                    }
                                    alt={state.url}
                                />
                            </div>
                        </div>
                        <div className="video__infos">
                            <Link href="/track/[id]" as={`/track/${track.id}`}>
                                <a>
                                    <strong>{state.name}</strong>
                                </a>
                            </Link>
                            <div>
                                {/* Start */}
                                {/* <span className="video__player-text">--:-- / </span> */}
                                <span className="video__player-text">{secondsToTime(state.playedSeconds)} / </span>
                                {/* Total */}
                                <span className="video__player-text">{secondsToTime(state.duration)}</span>
                                {/* Genre */}
                                {/* <span className="video__player-text"> - N/A</span> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="video__actions">
                    <div className="video__actions-buttons">
                        <HeartOutlined style={{ color: '#606060' }} />
                        {/* <HeartFilled /> */}
                        <BackwardOutlined style={{ color: '#606060' }} />
                        {!state.playing && <CaretRightOutlined onClick={handlePlayPause} />}
                        {state.playing && <PauseOutlined onClick={handlePlayPause} />}
                        <ForwardOutlined style={{ color: '#606060' }} />
                        <RetweetOutlined
                            style={{ color: state.loop ? 'inherit' : '#606060' }}
                            onClick={() => toggleLoop()}
                        />
                    </div>
                </div>
                <div className="video__volume">
                    <SoundOutlined />
                    <Slider
                        defaultValue={1}
                        min={0}
                        max={1}
                        value={state.volume}
                        tipFormatter={null}
                        step={0.01}
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
