import { z, type ZodTypeAny } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  SclProgramSchema,
  SclRelationSchema,
  type ArgumentType,
  type SclRelation,
} from "~/utils/schemas-types";

import { env } from "../../../env.mjs";

const typeToSchema: Record<ArgumentType, ZodTypeAny> = {
  String: z.coerce.string(),
  Integer: z.coerce.number().int(),
  Float: z.coerce.number(),
  Boolean: z.enum(["true", "True", "false", "False"]).transform((val) => {
    if (val === "true" || val === "True") {
      return true;
    }
    return false;
  }),
};

// generates a Zod schema for the given relation.
const relationToSchema = (relation: SclRelation) => {
  const schema = relation.args.map((arg) => typeToSchema[arg.type]);
  return z.tuple([z.number(), z.tuple(schema as [])]).array();
};

export const scallopRouter = createTRPCRouter({
  run: publicProcedure
    .input(
      z.object({
        program: SclProgramSchema,
        inputs: SclRelationSchema.array(),
        outputs: SclRelationSchema.array(),
      })
    )
    .mutation(async ({ input }) => {
      input.inputs = input.inputs.map((relation) => {
        z.setErrorMap((_issue, ctx) => {
          return {
            message: `[@input ${relation.name}]: ${ctx.defaultError}`,
          };
        });
        return {
          ...relation,
          facts: relationToSchema(relation).parse(relation.facts),
        };
      });

      console.log("inputs into server:", JSON.stringify(input.inputs));

      const endpoint = new URL("api/run-scallop", env.FLASK_SERVER);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      z.setErrorMap((_issue, ctx) => {
        return {
          message: `[@output]: ${ctx.defaultError}`,
        };
      });

      const outputRelSchema: Record<string, ZodTypeAny> = {};
      input.outputs.forEach((relation) => {
        outputRelSchema[relation.name] = relationToSchema(relation);
      });

      const schema = z.object(outputRelSchema);
      const body = schema.parse(await res.json());

      return body;
    }),
});
