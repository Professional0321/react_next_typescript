import { ObjectType, Field, Int } from 'type-graphql';
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from './User';
import { Upvote } from './Upvote';

@ObjectType()
@Entity()
export class Track extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    url!: string;

    @Field()
    @Column({ type: 'int', default: 0 })
    votes!: number;

    @Field(() => Int, { nullable: true })
    voteStatus!: number | null; // 1 || -1 || null

    @Field()
    @Column()
    creatorId!: number;

    @Field()
    @ManyToOne(() => User, (user) => user.tracks)
    creator!: User;

    @OneToMany(() => Upvote, (upvote) => upvote.track)
    upvotes!: Upvote[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;
}
