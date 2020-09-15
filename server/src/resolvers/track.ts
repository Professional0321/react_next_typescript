import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Track } from '../entities/Track';
import { MyContext } from '../types';

@Resolver()
export class TrackResolver {
    // Find all tracks
    @Query(() => [Track])
    tracks(@Ctx() { em }: MyContext): Promise<Track[]> {
        return em.find(Track, {});
    }

    // Find track by id
    @Query(() => Track, { nullable: true })
    track(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
        ): Promise<Track | null> {
            return em.findOne(Track, { id });
    }

    // Create new track
    @Mutation(() => Track)
    async createTrack(
        @Arg('name') name: string,
        @Ctx() { em }: MyContext
        ): Promise<Track> {
            const track = em.create(Track, { name });
            await em.persistAndFlush(track);
            return track;
    }

    // Find update track by id
    @Mutation(() => Track, { nullable: true })
    async updateTrack(
        @Arg('id') id: number,
        @Arg('name', () => String, { nullable: true }) name: string,
        @Ctx() { em }: MyContext
        ): Promise<Track | null> {
            const track = await em.findOne(Track, { id });
            if (!track) {
                return null;
            }
            if (typeof name !== 'undefined') {
                track.name = name
                await em.persistAndFlush(track);
            }
            return track;
    }

    // Delete track by id
    @Mutation(() => Boolean)
    async deleteTrack(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
        ): Promise<boolean> {
            try {
                await em.nativeDelete(Track, { id });
            } catch {
                return false;
            }
            return true;
    }
};