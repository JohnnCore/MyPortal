import { z } from 'zod';

// Define your main Zod schema
export const IssueFormSchema = z.object({
  projectId: z.number().min(1, { message: 'Project is required' }),

  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),

  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .min(10, { message: 'Description must be at least 10 characters' }),

  priorityId: z.number().min(1, { message: 'Priority is required' }),

  typeId: z.number().min(1, { message: 'Type is required' }),

  assigneeUser: z
    .union([
      z.object({
        id: z.number(),
        name: z.string(),
      }),
      //  z.string()
    ])
    .optional(),
  // .nullable(),

  statusId: z.number().min(1, { message: 'Status is required' }),

  tags: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),

  confirmSubmission: z.boolean().refine((val) => val === true, {
    message: 'Please confirm your submission',
  }),
});

// Export the inferred TypeScript type
export type IssueFormData = z.infer<typeof IssueFormSchema>;
