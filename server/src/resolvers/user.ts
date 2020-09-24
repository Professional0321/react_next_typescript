import {
  Resolver,
  Arg,
  Field,
  Mutation,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernameEmailPasswordInput } from "./UsernameEmailPasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Le mot de passe doit comporter au moins 6 caractères.",
          },
        ],
      };
    }

    // Verify token
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expiré.",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId)
    const user = await User.findOne(userIdNum);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "L'utilisateur n'existe plus.",
          },
        ],
      };
    }

    // Hash password + save
    await User.update(
      { id: userIdNum },
      {
      password: await argon2.hash(newPassword),
    }
    );

    // Delete after use
    await redis.del(key);

    // Login user after password change
    req.session.userId = userId;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email }});
    if (!user) {
      return true;
    }

    // UUID token
    const token = v4();

    // Store in redis
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Réinitialiser le mot de passe</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // Not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernameEmailPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(
        {
          username: options.username,
          email: options.email,
          password: hashedPassword,
        }
      )
      .returning('*')
      .execute();
      user = result.raw[0];

    } catch (error) {
      console.log(error);
      // ERROR: Duplicate username
      if (error.code === "23505") {
        // || error.detail.includes('already exists') {
        return {
          errors: [
            {
              field: "username",
              message: "Ce nom d'utilisateur existe déjà.",
            },
          ],
        };
      }
    }

    // Login after register (store userId in session - set cookie of user)
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail }}
        : { where: { username: usernameOrEmail }}
    );
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Cet utilisateur n'existe pas.",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Nom d'utilisateur ou mot de passe incorrect.",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((error) => {
        res.clearCookie(COOKIE_NAME);
        if (error) {
          console.log(error);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
