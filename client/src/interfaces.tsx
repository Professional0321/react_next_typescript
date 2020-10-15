import { Track } from './generated/graphql';

export interface ISiteLayout {
    children: React.ReactNode;
}

export interface IgetLayout {
    page: React.ReactNode;
}

export interface IPlayer {
    track: Track;
    tracks: Array<Track>;
    playing: boolean;
}
