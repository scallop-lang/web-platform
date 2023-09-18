import { getServerSession } from "next-auth";
import type { GetServerSidePropsContext } from "next/types";

import { authOptions } from "~/pages/api/auth/[...nextauth]";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const generateSSRHelper = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  return appRouter.createCaller({
    session,
    prisma,
  });
};
