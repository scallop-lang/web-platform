import { z } from "zod";

const SclProgramSchema = z.string();

const Provenances = [
  "unit",
  "proofs",
  "minmaxprob",
  "addmultprob",
  "topkproofs",
] as const;
const SclProvenanceSchema = z.enum(Provenances);
const SclProvenanceKSchema = z.number().positive().optional();

const FactSchema = z.object({
  tag: z.number(),
  tuple: z.coerce.string().array(),
});

const SclRelationRecordSchema = z.record(z.string(), FactSchema.array());

const UpdateProjectSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  program: SclProgramSchema.optional(),
});

export {
  Provenances,
  SclProgramSchema,
  SclProvenanceKSchema,
  SclProvenanceSchema,
  SclRelationRecordSchema,
  UpdateProjectSchema,
};
