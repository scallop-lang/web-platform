import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { env } from "../../../env.mjs";

export const scallopRouter = createTRPCRouter({
  run: publicProcedure
    .input(
      z.object({
        program: z.string(),
        inputs: z
          .object({
            name: z.string(),
            facts: z.tuple([z.number(), z.any().array()]).array(),
          })
          .array(),
        outputs: z.string().array(),
      })
    )
    .query(async ({ input }) => {
      const endpoint = new URL("api/run-scallop", env.FLASK_SERVER);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const schema = z.record(z.tuple([z.number(), z.any().array()]).array());
      const body = schema.parse(await res.json());

      return body;
    }),
});
