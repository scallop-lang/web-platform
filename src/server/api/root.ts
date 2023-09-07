import { createTRPCRouter } from "./trpc";
import { demoRouter } from "./routers/demo";
import { scallopRouter } from "./routers/scallop";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  demo: demoRouter,
  scallop: scallopRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
