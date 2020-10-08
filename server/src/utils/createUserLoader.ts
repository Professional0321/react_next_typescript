import DataLoader from 'dataloader';
import { User } from '../entities/User.ts';

// Fetch individual fields
// Group creatorIds in 1 array to make it only 2 queries in TrackResolver
// [1, 2, 3, 4] => [{id: 1, username: 'Q'}]
export const createUserLoader = () =>
    new DataLoader<number, User>(async (userIds) => {
        const users = await User.findByIds(userIds as number[]);
        const userIdToUser: Record<number, User> = {};
        users.forEach((u) => {
            userIdToUser[u.id] = u;
        });

        const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
        return sortedUsers;
    });
