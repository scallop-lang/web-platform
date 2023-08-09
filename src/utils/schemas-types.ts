import { z } from "zod";

const NameSchema = z.string().regex(new RegExp("^[a-z]\\w*$", "i"))

// the current Scallop types we support
const ArgTypeSchema = z.union([
  z.literal("String"),
  z.literal("Integer"),
  z.literal("Float"),
  z.literal("Boolean"),
]);

// exported so that we can iterate over them. also see
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
const argumentTypes = ["String", "Integer", "Float", "Boolean"] as const;

const ArgSchema = z.object({
  name: NameSchema.optional(),
  type: ArgTypeSchema,
});

const SclRelationSchema = z.object({
  name: NameSchema,
  args: ArgSchema.array(),
  facts: z.tuple([z.number(), z.string().array()]).array().optional(),
});

const SclProgramSchema = z.string().min(1);
const SclInputSchema = SclRelationSchema.required();
const SclOutputSchema = SclRelationSchema.omit({ facts: true });

type ArgumentType = z.infer<typeof ArgTypeSchema>;
type Argument = z.infer<typeof ArgSchema>;
type ScallopProgram = z.infer<typeof SclProgramSchema>;
type ScallopInput = z.infer<typeof SclInputSchema>;
type ScallopOutput = z.infer<typeof SclOutputSchema>;
type InputRecord = Record<string, ScallopInput>;
type OutputRecord = Record<string, ScallopOutput>;

export type {
  Argument,
  ArgumentType,
  InputRecord,
  OutputRecord,
  ScallopInput,
  ScallopOutput,
  ScallopProgram,
};

export {
  ArgSchema,
  ArgTypeSchema,
  SclInputSchema,
  SclOutputSchema,
  SclProgramSchema,
  SclRelationSchema,
  argumentTypes,
};
