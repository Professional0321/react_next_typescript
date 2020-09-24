import {
    Resolver,
    Query,
    Arg,
    Mutation,
} from 'type-graphql';
import { Track } from '../entities/Track';

@Resolver()
export class TrackResolver {
    // Find all tracks
    @Query(() => [Track])
    async tracks(): Promise<Track[]> {
        return Track.find();
    }

    // Find track by id
    @Query(() => Track, { nullable: true })
    track(
        @Arg('id') id: number,
        ): Promise<Track | undefined> {
            return Track.findOne(id);
    }

    // Create new track
    @Mutation(() => Track)
    async createTrack(
        @Arg('name') name: string,
        ): Promise<Track> {
            return Track.create({ name }).save();
    }

    // Find update track by id
    @Mutation(() => Track, { nullable: true })
    async updateTrack(
        @Arg('id') id: number,
        @Arg('name', () => String, { nullable: true }) name: string,
        ): Promise<Track | null> {
            const track = await Track.findOne(id);
            if (!track) {
                return null;
            }
            if (typeof name !== 'undefined') {
                await Track.update({ id }, { name });
            }
            return track;
    }

    // Delete track by id
    @Mutation(() => Boolean)
    async deleteTrack(
        @Arg('id') id: number,
        ): Promise<boolean> {
            await Track.delete(id);
            return true;
    }
};