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
import React, { useRef, useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import '../styles/components/player.less';
import { getYouTubeId } from '../utils/getYouTubeId';
import { secondsToTime } from '../utils/secondsToTime';
import { IPlayer } from '../interfaces';
import { TProgressProps, TPlayerStateProps } from '../types';
import { AppContext } from '../context/context';
import { TypesPlayer } from '../reducers/reducers';

// TODO:
const Player: React.FC<IPlayer> = ({}) => {
    const { state, dispatch } = useContext(AppContext);

    const ref = useRef<ReactPlayer>(null);
    const [isReady, setIsReady] = useState<boolean>(false);

    // ReactPlayer Functions
    const handlePlayPause = () => {
    dispatch({
        type: TypesPlayer.PlayPause,
    });
    };
    const handlePlay = () => {
        dispatch({
            type: TypesPlayer.Play,
        });
    };
    const handlePause = () => {
        dispatch({
            type: TypesPlayer.Pause,
        });
    };
    const toggleLoop = () => {
    dispatch({
        type: TypesPlayer.ToggleLoop,
    });
    };
    const handleVolumeChange = (volume: number) => {
    dispatch({
        type: TypesPlayer.VolumeChange,
        payload: volume,
    });
    };

    const handleSeekChange = (value: number) => {
        dispatch({
            type: TypesPlayer.SeekChange,
            payload: value,
        });
    };
    const handleSeekMouseUp = (value: number) => {
        dispatch({
            type: TypesPlayer.SeekingChange,
            payload: value,
        });
        if (ref.current) {
            ref.current.seekTo(value);
        }
    };
    //
    const handleProgress = (progress: TProgressProps) => {
    //     // console.log('onProgress', progress);
    //     // Update only time slider if not seeking
        if (!state.player.seeking) {
        dispatch({
            type: TypesPlayer.ProgressChange,
            payload: progress,
        });
        }
    };

    const handleDuration = (duration: number) => {
        // console.log('onDuration', duration);
        dispatch({
            type: TypesPlayer.SaveDuration,
            payload: duration,
        });
    };

    const formatter = (value: number) => {
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
                        value={state.player.played}
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
                                url={state.track.url}
                                width="0px"
                                height="0px"
                                playing={state.player.playing}
                                loop={state.player.loop}
                                volume={state.player.volume}
                                onPlay={handlePlay}
                                onPause={handlePause}
                                onProgress={handleProgress}
                                onDuration={handleDuration}
                                onReady={() => setIsReady(true)}
                            />
                            <div className="video__player-thumbnail">
                                <img
                                    src={
                                        state?.track?.url
                                            ? `https://img.youtube.com/vi/${getYouTubeId(state.track.url)}/0.jpg`
                                            : ''
                                    }
                                    alt={state.track.url}
                                />
                            </div>
                        </div>
                        <div className="video__infos">
                            <Link href="/track/[id]" as={`/track/${state.track.id}`}>
                                <a>
                                    <strong>{state.track.name}</strong>
                                </a>
                            </Link>
                            <div>
                                {/* Start */}
                                {/* <span className="video__player-text">--:-- / </span> */}
                                <span className="video__player-text">{secondsToTime(state.player.playedSeconds)} / </span>
                                {/* Total */}
                                <span className="video__player-text">{secondsToTime(state.player.duration)}</span>
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
                        {!state.player.playing && <CaretRightOutlined onClick={handlePlayPause} />}
                        {state.player.playing && <PauseOutlined onClick={handlePlayPause} />}
                        <ForwardOutlined style={{ color: '#606060' }} />
                        <RetweetOutlined
                            style={{ color: state.player.loop ? 'inherit' : '#606060' }}
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
                        value={state.player.volume}
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
