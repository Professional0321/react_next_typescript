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
} from "type-graphql";
import { Track } from "../entities/Track";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class TrackInput {
  @Field()
  name: string;

  @Field()
  url: string;
}

@Resolver()
export class TrackResolver {
  // Find all tracks
  @Query(() => [Track])
  async tracks(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Track[]> {
    const realLimit = Math.min(50, limit);
    const queryBuiler = getConnection()
      .getRepository(Track)
      .createQueryBuilder("t")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);

    if (cursor) {
      queryBuiler.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }

    return queryBuiler.getMany();
  }

  // Find track by id
  @Query(() => Track, { nullable: true })
  track(@Arg("id") id: number): Promise<Track | undefined> {
    return Track.findOne(id);
  }

  // Create new track
  @Mutation(() => Track)
  @UseMiddleware(isAuth)
  async createTrack(
    @Arg("input") input: TrackInput,
    @Ctx() { req }: MyContext
  ): Promise<Track> {
    return Track.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  // Find update track by id
  @Mutation(() => Track, { nullable: true })
  async updateTrack(
    @Arg("id") id: number,
    @Arg("name", () => String, { nullable: true }) name: string
  ): Promise<Track | null> {
    const track = await Track.findOne(id);
    if (!track) {
      return null;
    }
    if (typeof name !== "undefined") {
      await Track.update({ id }, { name });
    }
    return track;
  }

  // Delete track by id
  @Mutation(() => Boolean)
  async deleteTrack(@Arg("id") id: number): Promise<boolean> {
    await Track.delete(id);
    return true;
  }
}
