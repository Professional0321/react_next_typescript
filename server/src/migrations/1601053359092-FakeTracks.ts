import {MigrationInterface, QueryRunner} from "typeorm";

export class FakeTracks1601052910426 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        insert into track (name, url, "creatorId") values ('For The Fallen Dreams - Stone', 'https://www.youtube.com/watch?v=-7dDTEYkdvE', 1);
        insert into track (name, url, "creatorId") values ('Falling In Reverse - Losing My Life', 'https://www.youtube.com/watch?v=SEbxwmjScr8', 1);
        insert into track (name, url, "creatorId") values ('Hollow Front - Nothing Lasts Forever', 'https://www.youtube.com/watch?v=DjvpBddXlq0', 1);
        insert into track (name, url, "creatorId") values ('Architects - Holy Hell', 'https://www.youtube.com/watch?v=hvWnnSCJHeM', 1);
        insert into track (name, url, "creatorId") values ('Hollow Front - Chameleon', 'https://www.youtube.com/watch?v=XInDDqK8Fuw', 1);
        insert into track (name, url, "creatorId") values ('The Johari Window - DNA', 'https://www.youtube.com/watch?v=4GeJ1roztLg', 1);
        insert into track (name, url, "creatorId") values ('IMMINENCE - Lighthouse', 'https://www.youtube.com/watch?v=mh4GQq3cL7Y', 1);
        insert into track (name, url, "creatorId") values ('For The Fallen Dreams - Unstoppable', 'https://www.youtube.com/watch?v=YHzinY2__hQ', 1);
        insert into track (name, url, "creatorId") values ('Saviour - Never Sleep', 'https://www.youtube.com/watch?v=shRuR-XeEHc', 1);
        insert into track (name, url, "creatorId") values ('IMMINENCE - Saturated Soul', 'https://www.youtube.com/watch?v=gKqfVmz85d0', 1);
        insert into track (name, url, "creatorId") values ('Our Mirage - Nightfall', 'https://www.youtube.com/watch?v=cY3Fm_77Wog', 1);
        insert into track (name, url, "creatorId") values ('Dream State - White Lies', 'https://www.youtube.com/watch?v=GwkUq3cXe8o', 1);
        insert into track (name, url, "creatorId") values ('Make Them Suffer - Erase Me', 'https://www.youtube.com/watch?v=TwZmtvD-Xgo', 1);
        insert into track (name, url, "creatorId") values ('IMMINENCE - Infectious', 'https://www.youtube.com/watch?v=UgPujyXPM84', 1);
        insert into track (name, url, "creatorId") values ('The Plot In You - FEEL NOTHING', 'https://www.youtube.com/watch?v=pjX3J9EpAr0', 1);
        insert into track (name, url, "creatorId") values ('Written By Wolves - To Tell You The Truth', 'https://www.youtube.com/watch?v=qg1sZYS5l9w', 1);
        insert into track (name, url, "creatorId") values ('Too Close To Touch - Nerve Endings', 'https://www.youtube.com/watch?v=8No28NDPEJc', 1);
        insert into track (name, url, "creatorId") values ('IMMINENCE - The Sickness', 'https://www.youtube.com/watch?v=s66MxUw2qgw', 1);
        insert into track (name, url, "creatorId") values ('Annisokay - nihilist blues (BMTH metal cover)', 'https://www.youtube.com/watch?v=VLGRymyT-mM', 1);
        insert into track (name, url, "creatorId") values ('Hollow Front - Don''t Fall Asleep', 'https://www.youtube.com/watch?v=7Yw-6PuzPS4', 1);
        insert into track (name, url, "creatorId") values ('SEVER - My Dream, My Agony', 'https://www.youtube.com/watch?v=LUcvjr3zGoE', 1);
        insert into track (name, url, "creatorId") values ('IMMINENCE - Erase', 'https://www.youtube.com/watch?v=5XuDkF_JZ58', 1);
        insert into track (name, url, "creatorId") values ('Silent Theory - Fragile Minds', 'https://www.youtube.com/watch?v=p-e1GbPb3f8', 1);
        insert into track (name, url, "creatorId") values ('CAPTIVES - Falling Apart', 'https://www.youtube.com/watch?v=xwjlzJrvmNc', 1);
        insert into track (name, url, "creatorId") values ('Dream on Dreamer - Don''t Lose Your Heart', 'https://www.youtube.com/watch?v=EKXJFv5VLOc', 1);
        insert into track (name, url, "creatorId") values ('For The Fallen Dreams - Stone', 'https://www.youtube.com/watch?v=-7dDTEYkdvE', 1);
        insert into track (name, url, "creatorId") values ('Nerv - Bad Habits', 'https://www.youtube.com/watch?v=8qM8zm-tBTs', 1);
        insert into track (name, url, "creatorId") values ('Fit For A King - When Everything Means Nothing', 'https://www.youtube.com/watch?v=cMbLDpUi3yE', 1);
        insert into track (name, url, "creatorId") values ('ANNISOKAY - Good Stories', 'https://www.youtube.com/watch?v=_qABWE9VBnw', 1);
        insert into track (name, url, "creatorId") values ('Architects - Doomsday', 'https://www.youtube.com/watch?v=RvWbcK3YQ_o', 1);
                `)
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
