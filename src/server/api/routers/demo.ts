import { z, type ZodTypeAny } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  SclProgramSchema,
  SclRelationSchema,
  SclRelationInputSchema,
  relationToSchema,
} from "~/utils/schemas-types";

import { env } from "../../../env.mjs";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

// help

export const demoRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z
        .object({
          title: z.string().max(255),
          description: z.string().optional(),
          program: SclProgramSchema,
          inputs: SclRelationInputSchema.array(),
          outputs: SclRelationSchema.array(),
        })
        .transform((demo) => {
          return {
            ...demo,
            inputs: JSON.stringify(demo.inputs),
            outputs: JSON.stringify(demo.outputs),
          };
        })
    )
    .mutation(async ({ ctx, input }) => {
      const demo = await ctx.prisma.demo.create({
        data: input,
      });
      return demo;
    }),
});
