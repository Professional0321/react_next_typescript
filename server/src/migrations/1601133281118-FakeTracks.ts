import { MigrationInterface, QueryRunner } from 'typeorm';

export class FakeTracks1601133281118 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        insert into track (name, url, "creatorId", "createdAt") values ('For The Fallen Dreams - Stone', 'https://www.youtube.com/watch?v=-7dDTEYkdvE', 1, '2020-02-06T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Falling In Reverse - Losing My Life', 'https://www.youtube.com/watch?v=SEbxwmjScr8', 1, '2020-02-07T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Hollow Front - Nothing Lasts Forever', 'https://www.youtube.com/watch?v=DjvpBddXlq0', 1, '2020-02-08T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Architects - Holy Hell', 'https://www.youtube.com/watch?v=hvWnnSCJHeM', 1, '2020-02-09T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Hollow Front - Chameleon', 'https://www.youtube.com/watch?v=XInDDqK8Fuw', 1, '2020-02-10T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('The Johari Window - DNA', 'https://www.youtube.com/watch?v=4GeJ1roztLg', 1, '2020-02-11T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('IMMINENCE - Lighthouse', 'https://www.youtube.com/watch?v=mh4GQq3cL7Y', 1, '2020-02-12T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('For The Fallen Dreams - Unstoppable', 'https://www.youtube.com/watch?v=YHzinY2__hQ', 1, '2020-02-13T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Saviour - Never Sleep', 'https://www.youtube.com/watch?v=shRuR-XeEHc', 1, '2020-02-13T09:22:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('IMMINENCE - Saturated Soul', 'https://www.youtube.com/watch?v=gKqfVmz85d0', 1, '2020-02-13T09:26:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Our Mirage - Nightfall', 'https://www.youtube.com/watch?v=cY3Fm_77Wog', 1, '2020-02-14T06:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Dream State - White Lies', 'https://www.youtube.com/watch?v=GwkUq3cXe8o', 1, '2020-02-14T07:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Make Them Suffer - Erase Me', 'https://www.youtube.com/watch?v=TwZmtvD-Xgo', 1, '2020-02-15T01:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('IMMINENCE - Infectious', 'https://www.youtube.com/watch?v=UgPujyXPM84', 1, '2020-02-15T05:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('The Plot In You - FEEL NOTHING', 'https://www.youtube.com/watch?v=pjX3J9EpAr0', 1, '2020-02-15T06:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Written By Wolves - To Tell You The Truth', 'https://www.youtube.com/watch?v=qg1sZYS5l9w', 1, '2020-02-15T07:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Too Close To Touch - Nerve Endings', 'https://www.youtube.com/watch?v=8No28NDPEJc', 1, '2020-02-16T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('IMMINENCE - The Sickness', 'https://www.youtube.com/watch?v=s66MxUw2qgw', 1, '2020-02-17T02:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Annisokay - nihilist blues (BMTH metal cover)', 'https://www.youtube.com/watch?v=VLGRymyT-mM', 1, '2020-02-17T04:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Hollow Front - Don''t Fall Asleep', 'https://www.youtube.com/watch?v=7Yw-6PuzPS4', 1, '2020-02-17T06:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('SEVER - My Dream, My Agony', 'https://www.youtube.com/watch?v=LUcvjr3zGoE', 1, '2020-02-17T08:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('IMMINENCE - Erase', 'https://www.youtube.com/watch?v=5XuDkF_JZ58', 1, '2020-02-17T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Silent Theory - Fragile Minds', 'https://www.youtube.com/watch?v=p-e1GbPb3f8', 1, '2020-02-18T02:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('CAPTIVES - Falling Apart', 'https://www.youtube.com/watch?v=xwjlzJrvmNc', 1, '2020-02-18T08:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Dream on Dreamer - Don''t Lose Your Heart', 'https://www.youtube.com/watch?v=EKXJFv5VLOc', 1, '2020-02-18T09:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('For The Fallen Dreams - Stone', 'https://www.youtube.com/watch?v=-7dDTEYkdvE', 1, '2020-02-20T02:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Nerv - Bad Habits', 'https://www.youtube.com/watch?v=8qM8zm-tBTs', 1, '2020-02-20T02:22:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Fit For A King - When Everything Means Nothing', 'https://www.youtube.com/watch?v=cMbLDpUi3yE', 1, '2020-02-20T02:24:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('ANNISOKAY - Good Stories', 'https://www.youtube.com/watch?v=_qABWE9VBnw', 1, '2020-02-21T01:20:02Z');
        insert into track (name, url, "creatorId", "createdAt") values ('Architects - Doomsday', 'https://www.youtube.com/watch?v=RvWbcK3YQ_o', 1, '2020-02-21T02:20:02Z');
`);
    }

    public async down(_: QueryRunner): Promise<void> {}
}
