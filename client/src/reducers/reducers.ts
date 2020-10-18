import { Track } from '../generated/graphql';

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm

// Common
// https://medium.com/hackernoon/finally-the-typescript-redux-hooks-events-blog-you-were-looking-for-c4663d823b01
type TActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              payload: M[Key];
          };
};


// Player
export enum TypesPlayer {
    OpenClosePlayer = 'OPEN_CLOSE_PLAYER',
    PlayPause = 'PLAY_PAUSE',
    Play = 'PLAY',
    Pause = 'PAUSE',
    ToggleLoop = 'TOGGLE_LOOP',
    VolumeChange = 'VOLUME_CHANGE',
    SeekingChange = 'SEEKING_CHANGE',
    SeekChange = 'SEEK_CHANGE',
    ProgressChange = 'PROGRESS_CHANGE',
    SaveDuration = 'SAVE_DURATION',
};

type TPlayer = {
        isOpen: boolean,
        url: string | string[] | null | undefined;
        playing: boolean;
        volume: number;
        seeking: boolean;
        played: number;
        playedSeconds: number;
        loaded: number;
        duration: number;
        loop: boolean;
    };

type TPlayerPayload = {
    [TypesPlayer.OpenClosePlayer]: undefined;
    [TypesPlayer.PlayPause]: undefined;
    [TypesPlayer.Play]: undefined;
    [TypesPlayer.Pause]: undefined;
    [TypesPlayer.ToggleLoop]: undefined;
    [TypesPlayer.VolumeChange]: {
        volume: number;
    };
    [TypesPlayer.SeekingChange]: {
        seeking: boolean;
    };
    [TypesPlayer.SeekChange]: {
        played: number;
    };
    [TypesPlayer.ProgressChange]: {
        played: number;
        playedSeconds: number;
    };
    [TypesPlayer.SaveDuration]: {
        duration: number;
    };
};

export type TPlayerActions = TActionMap<TPlayerPayload>[keyof TActionMap<TPlayerPayload>];

export const playerReducer = (state: TPlayer, action: TPlayerActions) => {
    switch (action.type) {
        case TypesPlayer.OpenClosePlayer:
            if (!state.isOpen) {
                return {
                    ...state,
                    isOpen: true,
                    playing: true,
                };
            }
            return {
                ...state,
                isOpen: false,
                playing: false,
            }
        case TypesPlayer.PlayPause:
            return {
                ...state,
                playing: !state.playing,
                seeking: false,
            };
        case TypesPlayer.Play:
            return {
                ...state,
                playing: true,
                seeking: false,
            };
        case TypesPlayer.Pause:
            return {
                ...state,
                playing: false,
            };
        case TypesPlayer.ToggleLoop:
            return {
                ...state,
                loop: !state.loop,
            };
        case TypesPlayer.VolumeChange:
            return {
                ...state,
                volume: action.payload,
            };
        case TypesPlayer.SeekingChange:
            return {
                ...state,
                seeking: action.payload,
            };
        case TypesPlayer.SeekChange:
            return {
                ...state,
                played: action.payload,
            };
        case TypesPlayer.ProgressChange:
            return {
                ...state,
                played: action.payload.played,
                playedSeconds: action.payload.playedSeconds,
            };
        case TypesPlayer.SaveDuration:
            return {
                ...state,
                duration: action.payload,
            };
        default:
            return state;
    }
}

// Track
export enum TypesTrack {
    SaveTrack = 'SAVE_TRACK',
};

type TTrackPayload = {
    [TypesTrack.SaveTrack]: Track;
    track: Track,
};

export type TTrackActions = TActionMap<TTrackPayload>[keyof TActionMap<TTrackPayload>];


export const trackReducer = (state: Track, action: TTrackActions) => {
    switch (action.type) {
        case TypesTrack.SaveTrack:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state;
    }
}

// Tracks
export enum TypesTracks {
    SaveTracks = 'SAVE_TRACKS',
}
type TTracksPayload = {
    [TypesTracks.SaveTracks]: Track[];
};
export type TTracksActions = TActionMap<TTracksPayload>[keyof TActionMap<TTracksPayload>];

export const tracksReducer = (state: Track[], action: TTracksActions) => {
    switch (action.type) {
        case TypesTracks.SaveTracks:
            return [
                ...state,
                ...action.payload,
            ]
        default:
            return state;
    }
};