import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  SclProgramSchema,
  SclRelationSchema,
  SclRelationInputSchema,
  type SclRelation,
  type SclRelationInput,
} from "~/utils/schemas-types";

import { TRPCError } from "@trpc/server";

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

  getDemoById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const demo = await ctx.prisma.demo.findUnique({
        where: { id: input.id },
      });

      if (!demo) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...demo,
        inputs: JSON.parse(demo.inputs) as SclRelationInput,
        outputs: JSON.parse(demo.outputs) as SclRelation,
      };
    }),
});
