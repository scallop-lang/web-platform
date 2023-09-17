import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  FactSchema,
  SclProgramSchema,
  SclRelationInputSchema,
  SclRelationSchema,
  type Fact,
} from "~/utils/schemas-types";

import { env } from "../../../env.mjs";

export const scallopRouter = createTRPCRouter({
  run: publicProcedure
    .input(
      z.object({
        program: SclProgramSchema,
        inputs: SclRelationInputSchema.array(),
        outputs: SclRelationSchema.array(),
      })
    )
    .mutation(async ({ input }) => {
      const endpoint = new URL("api/run-scallop", env.FLASK_SERVER);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const json = z
          .object({
            error: z.string(),
          })
          .parse(await res.json());
        if (res.status >= 500) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: json.error,
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: json.error,
          });
        }
      }

      const body: Record<string, Fact[]> = z
        .record(z.string(), FactSchema.array())
        .parse(await res.json(), {
          errorMap: (_issue, ctx) => {
            return {
              message: `[@output]: ${ctx.defaultError}`,
            };
          },
        });

      return body;
    }),
});
