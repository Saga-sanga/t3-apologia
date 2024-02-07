import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template";
import { LoginTemplate } from "@/components/email/login-template";
import React from "react";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const userDbInfo = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, user.id),
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: userDbInfo?.role,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  // @ts-expect-error - This is probably an error from the T3 config itself
  adapter: DrizzleAdapter(db),
  providers: [
    // TODO: Imporve react email template design
    EmailProvider({
      from: env.RESEND_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const [user] = await db
          .select({ emailVerified: users.emailVerified })
          .from(users)
          .where(eq(users.email, identifier));

        const { host } = new URL(url);

        const res = await resend.emails.send({
          from: provider.from,
          to: identifier,
          subject: user?.emailVerified
            ? `Login to ${host}`
            : `Sign in to ${host}`,
          react: user?.emailVerified
            ? (LoginTemplate({ url }) as React.ReactElement)
            : (EmailTemplate({ url }) as React.ReactElement),
        });

        console.log(res);

        if (res.error) {
          throw new Error(res.error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

/**
 * Wrapper for `getServerSession` so that you can get the current user without importing `authOptions` all the time.
 */
export const getCurrentUser = async () => {
  const session = await getServerAuthSession();

  return session?.user;
};
