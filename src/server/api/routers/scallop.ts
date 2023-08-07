import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { env } from "../../../env.mjs";

export const scallopRouter = createTRPCRouter({
  runScallop: publicProcedure
    .input(
      z.object({
        inputs: z
          .object({
            name: z.string(),
            facts: z.tuple([z.number(), z.any().array()]).array(),
          })
          .array(),
        program: z.string(),
        outputs: z.string().array(),
      })
    )
    .query(async ({ input }) => {
      const res = await fetch(env.FLASK_SERVER + "api/run-scallop", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      
      return res;
    }),
});
