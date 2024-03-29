import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { UpdateProjectSchema } from "~/utils/schemas-types";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.user ? ctx.session.user.id : null;
    const project = await ctx.prisma.project.create({
      data: {
        title: "Untitled project",
        program: "",
        authorId: userId,
      },
    });
    return project;
  }),

  deleteProjectById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user ? ctx.session.user.id : null;
      const project = await ctx.prisma.project.delete({
        where: {
          id: input.id,
          authorId: userId,
        },
      });
      return project;
    }),

  getPublicProjects: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      take: 100,
      where: {
        published: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return projects;
  }),

  getProjectsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user ? ctx.session.user.id : null;
    const projects = await ctx.prisma.project.findMany({
      take: 100,
      where: {
        authorId: userId,
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return projects;
  }),

  getProjectById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      let project = await ctx.prisma.project.findUnique({
        where: { id: input.id, published: true },
      });

      if (!project && ctx.session?.user) {
        project = await ctx.prisma.project.findUnique({
          where: { id: input.id, authorId: ctx.session.user.id },
        });
      }

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      return project;
    }),

  updateProjectById: protectedProcedure
    .input(z.object({ id: z.string(), project: UpdateProjectSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user ? ctx.session.user.id : null;
      const project = await ctx.prisma.project.update({
        where: {
          id: input.id,
          authorId: userId,
        },
        data: input.project,
      });
      return project;
    }),

  getExampleProjects: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        author: {
          role: "ADMIN",
        },
        published: true,
      },
    });
    return projects;
  }),
});
