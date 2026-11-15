import { z } from "zod";

import { descriptionSchema, metricKeySchema, nameSchema } from "./common";

export const metricDataTypeSchema = z.enum([
  "number",
  "integer",
  "string",
  "boolean",
]);

const unitSchema = z.string().trim().max(40).nullable().optional();

/** One telemetry parameter a device of this template sends. */
export const templateParameterSchema = z
  .object({
    metric_definition_id: z.uuid(),
    key: metricKeySchema,
    label: nameSchema,
    data_type: metricDataTypeSchema,
    unit: unitSchema,
    symbol: unitSchema,
  })
  .strict();

const templateParameterRequestSchema = z
  .object({
    metric_definition_id: z.uuid().nullable().optional(),
    key: metricKeySchema.optional(),
    label: nameSchema.optional(),
    data_type: metricDataTypeSchema.optional(),
    unit: unitSchema,
    symbol: unitSchema,
  })
  .strict()
  .refine(
    (parameter) => parameter.metric_definition_id || parameter.key,
    "A metric definition or parameter key is required",
  );

const parametersSchema = z
  .array(templateParameterRequestSchema)
  .max(200)
  .refine(
    (parameters) => {
      const definitionIds = parameters.flatMap((parameter) =>
        parameter.metric_definition_id ? [parameter.metric_definition_id] : [],
      );
      return new Set(definitionIds).size === definitionIds.length;
    },
    { message: "Each metric definition can only be used once in a template" },
  );

export const createTemplateSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    parameters: parametersSchema.default([]),
  })
  .strict();

export const updateTemplateSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);

export const replaceTemplateParametersSchema = z
  .object({ parameters: parametersSchema })
  .strict();

/** A custom catalogue entry created by an organisation. */
export const createMetricDefinitionSchema = z
  .object({
    key: metricKeySchema,
    label: nameSchema,
    data_type: metricDataTypeSchema,
    unit: unitSchema,
    symbol: unitSchema,
  })
  .strict();

export type MetricDataType = z.infer<typeof metricDataTypeSchema>;
export type TemplateParameterInput = z.infer<typeof templateParameterSchema>;
export type TemplateParameterRequestInput = z.infer<
  typeof templateParameterRequestSchema
>;
export type CreateTemplateInput = z.input<typeof createTemplateSchema>;
export type CreateTemplateValues = Omit<CreateTemplateInput, "parameters"> & {
  parameters: TemplateParameterInput[];
};
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ReplaceTemplateParametersInput = z.infer<
  typeof replaceTemplateParametersSchema
>;
export type CreateMetricDefinitionInput = z.infer<
  typeof createMetricDefinitionSchema
>;

// Responses

export const metricDefinitionSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  unit: z.string().nullable(),
  symbol: z.string().nullable(),
  data_type: metricDataTypeSchema,
  is_built_in: z.boolean(),
});

export const templateParameterResponseSchema = z.object({
  id: z.string(),
  metric_definition_id: z.string(),
  key: z.string(),
  label: z.string(),
  data_type: metricDataTypeSchema,
  unit: z.string().nullable(),
  symbol: z.string().nullable(),
});

export const templateSummarySchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  parameter_count: z.number().int(),
  device_count: z.number().int(),
});

export const templateSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  parameters: z.array(templateParameterResponseSchema),
  device_count: z.number().int(),
});

export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
export type TemplateParameter = z.infer<typeof templateParameterResponseSchema>;
export type TemplateSummary = z.infer<typeof templateSummarySchema>;
export type Template = z.infer<typeof templateSchema>;
