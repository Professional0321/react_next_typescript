import { useTrackQuery } from '../generated/graphql';
import { useGetIntId } from './useGetIntId';

export const useGetTrackFromUrl = () => {
    const intId = useGetIntId();

    return useTrackQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });
};
