import React from 'react';
import { createContext, useReducer, Dispatch } from 'react';
import {
    playerReducer,
    trackReducer,
    tracksReducer,
    TPlayerActions,
    TTrackActions,
    TTracksActions,
} from '../reducers/reducers'
import { TInitialState } from '../types';

const initialState = {
    player: {
        isOpen: false,
        url: null,
        playing: false,
        volume: 1,
        seeking: true,
        played: 0,
        playedSeconds: 0,
        loaded: 0,
        duration: 0,
        loop: false,
    },
    track: {},
    tracks: [],
}

const AppContext = createContext<{
    state: TInitialState,
    dispatch: Dispatch<TPlayerActions | TTrackActions | TTracksActions>;
}>({
    state: initialState,
    dispatch: () => null,
});

const mainReducer = ({ track, tracks, player }: TInitialState, action: TPlayerActions | TTrackActions | TTracksActions) => ({
    track: trackReducer(track, action),
    tracks: tracksReducer(tracks, action),
    player: playerReducer(player, action),
});

const AppProvider:React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(mainReducer, initialState);

    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider };

