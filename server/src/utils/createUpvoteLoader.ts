import DataLoader from 'dataloader';
import { Upvote } from '../entities/Upvote.ts';

// Fetch individual fields
// [{postId: 1, userId: 1}] => [{postId: 1, userId: 1, value: 1}]

export const createUpvoteLoader = () =>
    new DataLoader<{ trackId: number; userId: number }, Upvote | null>(async (keys) => {
        const upvotes = await Upvote.findByIds(keys as any);
        const upvoteIdToUpvote: Record<string, Upvote> = {};
        upvotes.forEach((upvote) => {
            upvoteIdToUpvote[`${upvote.userId} | ${upvote.trackId}`] = upvote;
        });

        return keys.map((key) => upvoteIdToUpvote[`${key.userId} | ${key.trackId}`]);
    });
