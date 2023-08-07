import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { env } from "../../../env.mjs";

const scallopProgram = z.string();

const scallopInputs = z
  .object({
    name: z.string(),
    facts: z.tuple([z.number(), z.any().array()]).array(),
  })
  .array();

const scallopOutputs = z.string().array();

export const scallopRouter = createTRPCRouter({
  run: publicProcedure
    .input(
      z.object({
        program: scallopProgram,
        inputs: scallopInputs,
        outputs: scallopOutputs,
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

export type ScallopInputs = z.infer<typeof scallopInputs>;
export type ScallopProgram = z.infer<typeof scallopProgram>;
export type ScallopOutputs = z.infer<typeof scallopOutputs>;
