import { Resolver, Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, ObjectType } from 'type-graphql';
import { Track } from '../entities/Track';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { Upvote } from '../entities/Upvote';

@InputType()
class TrackInput {
    @Field()
    name: string;

    @Field()
    url: string;
}

@ObjectType()
class PaginatedTracks {
    @Field(() => [Track])
    tracks: Track[];

    @Field()
    hasMore: boolean;
}

@Resolver(Track)
export class TrackResolver {
    // Upvote
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
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
        @Ctx() { req }: MyContext,
    ): Promise<PaginatedTracks> {
        // Fetch 1 more track
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (req.session.userId) {
            replacements.push(req.session.userId);
        }

        let cursorIndex = 3;
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
            cursorIndex = replacements.length;
        }

        const tracks = await getConnection().query(
            `
    select t.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
      ${
          req.session.userId
              ? '(select value from upvote where "userId" = $2 and "trackId" = t.id) "voteStatus"'
              : 'null as "voteStatus"'
      }
    from track t
    inner join public.user u on u.id = t."creatorId"
    ${cursor ? `where t."createdAt" < ${cursorIndex}` : ''}
    order by t."createdAt" DESC
    limit $1
    `,
            replacements,
        );

        // console.log('tracks: ', tracks);

        // Fetch 1 more track to check if hasMore === true
        // else end of tracks
        return {
            tracks: tracks.slice(0, realLimit),
            hasMore: tracks.length === realLimitPlusOne,
        };
    }

    // Find track by id
    @Query(() => Track, { nullable: true })
    track(@Arg('id', () => Int) id: number): Promise<Track | undefined> {
        return Track.findOne(id, { relations: ['creator'] });
    }

    // Create new track
    @Mutation(() => Track)
    @UseMiddleware(isAuth)
    async createTrack(
        @Arg('input') input: TrackInput,
        @Ctx() { req }: MyContext,
        ): Promise<Track> {
        return Track.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
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
