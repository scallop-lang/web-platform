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

export const projectRouter = createTRPCRouter({
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
        .transform((project) => {
          return {
            ...project,
            inputs: JSON.stringify(project.inputs),
            outputs: JSON.stringify(project.outputs),
          };
        })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: input,
      });
      return project;
    }),

  getProjectById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...project,
        inputs: JSON.parse(project.inputs) as SclRelationInput,
        outputs: JSON.parse(project.outputs) as SclRelation,
      };
    }),
});
