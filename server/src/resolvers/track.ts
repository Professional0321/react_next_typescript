import {
    Resolver,
    Query,
    Arg,
    Mutation,
    InputType,
    Field,
    Ctx,
    UseMiddleware,
    Int,
    ObjectType,
    FieldResolver,
    Root,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Track } from '../entities/Track';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';
import { getArtistName } from '../utils/getArtistName';
import { getYouTubeId } from '../utils/getYouTubeId';

@InputType()
class TrackInput {
    @Field()
    name!: string;

    @Field()
    url!: string;
}

@ObjectType()
class PaginatedTracks {
    @Field(() => [Track])
    tracks!: Track[];

    @Field()
    hasMore!: boolean;
}

@ObjectType()
class SearchTracks {
    @Field(() => [Track])
    tracks!: Track[];
}

@ObjectType()
class IdAndArtistTracks {
    @Field(() => Track)
    track!: Track;

    @Field(() => [Track])
    tracks!: Track[];
}

@Resolver(Track)
export class TrackResolver {
    @FieldResolver(() => User)

    // https://github.com/graphql/dataloader
    // Group/batch requests
    // DataLoader
    // Run only if query contains "creator"
    creator(@Root() track: Track, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(track.creatorId);
    }

    // DataLoader
    // Run only if query contains "voteStatus"
    @FieldResolver(() => Int, { nullable: true })
    async voteStatus(@Root() track: Track, @Ctx() { upvoteLoader, req }: MyContext) {
        if (!req.session.userId) {
            return null;
        }

        const upvote = await upvoteLoader.load({
            trackId: track.id,
            userId: req.session.userId,
        });

        return upvote ? upvote.value : null;
    }

    // Upvote
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    // Vote
    async vote(
        @Arg('trackId', () => Int) trackId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() { req }: MyContext,
    ) {
        const isUpvote = value !== -1;
        const realValue = isUpvote ? 1 : -1;
        const { userId } = req.session;

        // Check vote
        // Already voted
        const upvote = await Upvote.findOne({ where: { trackId, userId } });

        if (upvote && upvote.value !== realValue) {
            await getConnection().transaction(async (transManager) => {
                await transManager.query(
                    `
          update upvote
          set value = $1
          where "trackId" = $2 and "userId" = $3
          `,
                    [realValue, trackId, userId],
                );

                await transManager.query(
                    `
          update track
          set votes = votes + $1
          where id = $2
          `,
                    [2 * realValue, trackId],
                );
            });

            // Never voted
        } else if (!upvote) {
            await getConnection().transaction(async (transManager) => {
                await transManager.query(
                    `
          insert into upvote ("userId", "trackId", value)
          values ($1, $2, $3)
          `,
                    [userId, trackId, value],
                );

                await transManager.query(
                    `
            update track
            set votes = votes + $1
            where id = $2;
            `,
                    [realValue, trackId],
                );
            });
        }

        return true;
    }

    // Find all tracks
    @Query(() => PaginatedTracks)
    async tracks(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
        // @Ctx() { req }: MyContext,
    ): Promise<PaginatedTracks> {
        // Fetch 1 more track (useful to know if end of data or not)
        const realLimit = Math.min(50, limit);
        console.log('realLimit: ', realLimit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const tracks = await getConnection().query(
            `
    select t.*
    from track t
    ${cursor ? `where t."createdAt" < $2` : ''}
    order by t."createdAt" DESC
    limit $1
    `,
            replacements,
        );

        // console.log('tracks: ', tracks);
        console.log('tracks.length: ', tracks.length);
        console.log('realLimitPlusOne: ', realLimitPlusOne);
        console.log('hasMore: ', tracks.length === realLimitPlusOne);

        // Fetch 1 more track to check if hasMore === true
        // else end of tracks
        return {
            tracks: tracks.slice(0, realLimit),
            hasMore: tracks.length === realLimitPlusOne,
        };
    }

    // Find all tracks by %name%
    @Query(() => SearchTracks)
    async getTracksByName(
        @Arg('name', () => String!) name: string,
        ): Promise<SearchTracks | undefined> {
        const tracks = await getConnection().query(
            `
    select t.*
    from track t
    where t."name" LIKE '%${name}%'
    order by t."createdAt" DESC
    `,
        );

        // console.log('name: ', name);
        // console.log('tracks: ', tracks);

        if (!tracks.tracks) {
            throw new Error('Pas de résultat pour cette recherche.');
        }
        return { tracks };
    }

    // Find track by id + same artist tracks
    @Query(() => IdAndArtistTracks)
    async trackByIdAndSameArtistTracks(
        @Arg('id', () => Int) id: number,
        ): Promise<IdAndArtistTracks | undefined> {
        const track = await Track.findOne(id);

        if (!track) {
            throw new Error('Pas de musique avec cet ID.');
        }
        const name = getArtistName(track.name);

        const tracks = await getConnection().query(
            `
        select t.*
        from track t
        where t."name" LIKE '%${name}%'
        order by t."createdAt" DESC
        `,
        );

        // console.log('name: ', name);
        // console.log('tracks: ', tracks);

        if (!tracks) {
            throw new Error('Pas de résultat pour cette recherche.');
        }

        // Filter track from query Id
        const tracksFiltered = tracks.filter((t: Track) => track.id !== t.id);
        // console.log(tracksFiltered);

        return {
            track: track,
            tracks: tracksFiltered,
        };
    }

    // Find track by id
    @Query(() => Track)
    async track(
        @Arg('id', () => Int) id: number,
        ): Promise<Track | undefined> {
        const track = await Track.findOne(id);

        if (!track) {
            throw new Error('Pas de musique avec cet ID.');
        }
        return track;
    }

    // Create new track
    @Mutation(() => Track)
    @UseMiddleware(isAuth)
    async createTrack(
        @Arg('input') input: TrackInput,
        @Ctx() { req }: MyContext,
        ): Promise<Track> {
        // Check if YouTube video ID already exists in DB before saving
        const youtubeId = getYouTubeId(input.url);
        const trackAlreadyExists = await getConnection().query(
            `
    select t.*
    from track t
    where t."url" LIKE '%${youtubeId}%'
    `,
        );


        if (trackAlreadyExists) {
            throw new Error('Lien déjà posté !');
        } else {
            //
            const track = await Track.create({
                ...input,
                creatorId: req.session.userId,
            }).save();
            return track;
        }
    }

    // Update track by id
    @Mutation(() => Track, { nullable: true })
    @UseMiddleware(isAuth)
    async updateTrack(
        @Arg('id', () => Int) id: number,
        @Arg('name', () => String) name: string,
        @Arg('url', () => String) url: string,
        @Ctx() { req }: MyContext,
    ): Promise<Track | null> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Track)
            .set({ name, url })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
            .returning('*')
            .execute();

        return result.raw[0];
    }

    // Delete track by id
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteTrack(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext,
        ): Promise<boolean> {
        const track = await Track.findOne(id);
        if (!track) {
            return false;
        }
        if (track.creatorId !== req.session.userId) {
            throw new Error('Non autorisé.');
        }

        await Upvote.delete({ trackId: id });
        await Track.delete({ id });

        return true;
    }
}
