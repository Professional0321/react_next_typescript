import { Track } from './generated/graphql';

export type ErrorProps = {
    field?: string;
    message?: string;
};

export type TProgressProps = {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
};

export type TPlayerStateProps = {
    url: string | string[] | null | undefined;
    name: string;
    playing: boolean;
    volume: number;
    seeking: boolean;
    played: number;
    playedSeconds: number;
    loaded: number;
    duration: number;
    loop: boolean;
};

export type TChangePasswordForm = {
    newPassword: string;
    confirm: string;
};

export type TTrackFormProps = {
    name: string;
    url: string;
};

export type TLoginFormProps = {
    usernameOrEmail: string;
    password: string;
};

export type TRegisterFormProps = {
    username: string;
    email: string;
    password: string;
    confirm: string;
};

export type TForgotPasswordFormProps = {
    email: string;
};

// Player

export type TInitialStatePlayer = {
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
}
export type TInitialState = {
    player: TInitialStatePlayer;
    track: Track;
    tracks: Track[];
};