import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession, type DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
};

const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getServerSession(ctx.req, ctx.res, authOptions);
};

export { authOptions, getServerAuthSession };
