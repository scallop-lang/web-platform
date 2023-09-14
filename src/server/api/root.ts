import { projectRouter } from "./routers/project";
import { scallopRouter } from "./routers/scallop";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  scallop: scallopRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
