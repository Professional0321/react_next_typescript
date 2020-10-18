import { Track } from './generated/graphql';
import { ReactPlayerProps } from 'react-player';
import { TInitialStatePlayer } from './types';

export interface ISiteLayout {
    children: React.ReactNode;
}

export interface IgetLayout {
    page: React.ReactNode;
}

export interface IPlayer {
    track: Track;
    tracks: Track[];
    player: TInitialStatePlayer,
}

