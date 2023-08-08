import { z, type ZodTypeAny } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "../../../env.mjs";

const scallopProgram = z.string();

const scallopInput = z.object({
  type: z.literal("input"),
  name: z.string(),
  args: z
    .object({
      name: z.string(),
      type: z.string(),
    })
    .array(),
  facts: z.tuple([z.number(), z.string().array()]).array(),
});

const scallopOutput = z.object({
  type: z.literal("output"),
  name: z.string(),
  args: z
    .object({
      name: z.string(),
      type: z.string(),
    })
    .array(),
});

const typeToSchema: Record<string, ZodTypeAny> = {
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

function relationToSchema(relation: ScallopRelation) {
  const schema = relation.args.map((arg) => typeToSchema[arg.type]!);
  return z.tuple([z.number(), z.tuple(schema as [])]).array();
}

export const scallopRouter = createTRPCRouter({
  run: publicProcedure
    .input(
      z.object({
        program: scallopProgram,
        inputs: scallopInput.array(),
        outputs: scallopOutput.array(),
      })
    )
    .query(async ({ input }) => {
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

      console.log(JSON.stringify(input.inputs))

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

      const output_rel_schema: Record<string, ZodTypeAny> = {};
      input.outputs.forEach((relation) => {
        output_rel_schema[relation.name] = relationToSchema(relation);
      });

      const schema = z.object(output_rel_schema);
      const body = schema.parse(await res.json());

      return body;
    }),
});

export type ScallopRelation = {
  name: string;
  args: {
    name: string;
    type: string;
  }[];
  facts?: [number, string[]][];
};
export type ScallopProgram = z.infer<typeof scallopProgram>;
export type ScallopInput = z.infer<typeof scallopInput>;
export type ScallopOutput = z.infer<typeof scallopOutput>;
