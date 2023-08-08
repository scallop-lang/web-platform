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

function relationToZodSchema(
  name: string,
  args: { name: string; type: string }[]
) {
  const schema: ZodTypeAny[] = [];
  args.forEach((arg) => {
    const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
      return {
        message: `[@relation ${name}]: values for \`${arg.name}\` must be of type \`${arg.type}\``,
      };
    };
    z.setErrorMap(customErrorMap);

    const schemas: Record<string, ZodTypeAny> = {
      String: z.coerce.string(),
      Integer: z.coerce.number().int(),
      Float: z.coerce.number(),
      Boolean: z
        .union([
          z.literal("true"),
          z.literal("True"),
          z.literal("false"),
          z.literal("False"),
        ])
        .transform((val) => {
          if (val === "true" || val === "True") {
            return true;
          }
          return false;
        }),
    };

    schema.push(schemas[arg.type]!);
  });
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
        return {
          ...relation,
          facts: relationToZodSchema(relation.name, relation.args).parse(
            relation.facts
          ),
        };
      });

      console.log(JSON.stringify(input.inputs));

      const endpoint = new URL("api/run-scallop", env.FLASK_SERVER);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const output_rel_schema: Record<string, ZodTypeAny> = {};
      input.outputs.forEach((relation) => {
        output_rel_schema[relation.name] = relationToZodSchema(
          relation.name,
          relation.args
        );
      });

      const schema = z.object(output_rel_schema);
      const body = schema.parse(await res.json());

      return body;
    }),
});

export type ScallopProgram = z.infer<typeof scallopProgram>;
export type ScallopInput = z.infer<typeof scallopInput>;
export type ScallopOutput = z.infer<typeof scallopOutput>;
