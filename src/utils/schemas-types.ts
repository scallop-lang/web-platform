import { z, type ZodTypeAny } from "zod";

// the current Scallop types we support; exported so that we can iterate over them. also see
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
const argumentTypes = ["String", "Integer", "Float", "Boolean"] as const;

const NameSchema = z.string().regex(new RegExp("^[a-z]\\w*$", "i"));

const ArgTypeSchema = z.enum(argumentTypes);
const ArgSchema = z.object({
  id: z.string(),
  name: NameSchema.optional(),
  type: ArgTypeSchema,
});

const FactSchema = z.object({
  id: z.string(),
  tag: z.number(),
  tuple: z.coerce.string().array(),
});

const SclProgramSchema = z.string().min(1);
const SclRelationSchema = z.object({
  type: z.enum(["input", "output"]),
  name: NameSchema,
  args: ArgSchema.array(),
  probability: z.boolean(),
  facts: FactSchema.array(),
});

type ArgumentType = z.infer<typeof ArgTypeSchema>;
type Argument = z.infer<typeof ArgSchema>;
type Fact = z.infer<typeof FactSchema>;
type SclProgram = z.infer<typeof SclProgramSchema>;
type SclRelation = z.infer<typeof SclRelationSchema>;
type SclRelationInput = z.infer<typeof SclRelationInputSchema>;
type RelationRecord = Record<string, SclRelation>;

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

const SclRelationInputSchema = SclRelationSchema.transform((relation) => {
  return {
    ...relation,
    facts: relationToSchema(relation).parse(
      relation.facts.map((fact) => [fact.tag, fact.tuple]),
      {
        errorMap: (_issue, ctx) => {
          return {
            message: `[@rel ${relation.name}]: ${ctx.defaultError}`,
          };
        },
      }
    ),
  };
});

const ProjectSchema = z
  .object({
    title: z.string().max(255),
    description: z.string().optional(),
    program: SclProgramSchema,
    inputs: SclRelationInputSchema.array(),
    outputs: SclRelationSchema.array(),
  })
  .transform((project) => {
    return {
      ...project,
      inputs: JSON.stringify(project.inputs),
      outputs: JSON.stringify(project.outputs),
    };
  });

export type {
  Argument,
  ArgumentType,
  Fact,
  RelationRecord,
  SclProgram,
  SclRelation,
  SclRelationInput,
};

export {
  ArgSchema,
  ArgTypeSchema,
  SclProgramSchema,
  SclRelationSchema,
  SclRelationInputSchema,
  ProjectSchema,
  argumentTypes,
  relationToSchema,
};
