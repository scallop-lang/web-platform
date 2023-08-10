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

const SclProgramSchema = z.string().min(1);
const SclRelationSchema = z.object({
  type: z.enum(["input", "output"]),
  name: NameSchema,
  args: ArgSchema.array(),
  facts: z.tuple([z.number(), z.string().array()]).array(),
});

type ArgumentType = z.infer<typeof ArgTypeSchema>;
type Argument = z.infer<typeof ArgSchema>;
type SclProgram = z.infer<typeof SclProgramSchema>;
type SclRelation = z.infer<typeof SclRelationSchema>;
type RelationRecord = Record<string, SclRelation>;

export type { Argument, ArgumentType, RelationRecord, SclProgram, SclRelation };

export {
  ArgSchema,
  ArgTypeSchema,
  SclProgramSchema,
  SclRelationSchema,
  argumentTypes,
};
