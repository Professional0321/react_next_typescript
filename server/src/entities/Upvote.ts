// import { ObjectType, Field } from "type-graphql";
import {
    Entity,
    Column,
    BaseEntity,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { Track } from "./Track";

@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: 'int' })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  trackId: number;

  @ManyToOne(() => Track, (track) => track.upvotes)
  track: Track;
}
