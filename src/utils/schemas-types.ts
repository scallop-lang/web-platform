import { z } from "zod";

// the current Scallop types we support; exported so that we can iterate over them. also see
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
const argumentTypes = ["String", "Integer", "Float", "Boolean"] as const;

const NameSchema = z.string().regex(new RegExp("^[a-z]\\w*$", "i"));

const ArgTypeSchema = z.enum(argumentTypes);
const ArgSchema = z.object({
  name: NameSchema.optional(),
  type: ArgTypeSchema,
});

const FactSchema = z.object({
  id: z.string(),
  tag: z.number(),
  tuple: z.string().array(),
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
type RelationRecord = Record<string, SclRelation>;

export type {
  Argument,
  ArgumentType,
  Fact,
  RelationRecord,
  SclProgram,
  SclRelation,
};

export {
  ArgSchema,
  ArgTypeSchema,
  SclProgramSchema,
  SclRelationSchema,
  argumentTypes,
};
