import { z } from 'zod';

// Define your main Zod schema
export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, { message: 'Username is required' })
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(30, { message: 'Username must be less than 30 characters' }),

    email: z
      .email({ message: 'Invalid email address' })
      .trim()
      .min(1, { message: 'Email is required' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must be less than 100 characters' }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

// Export the inferred TypeScript type
export type RegisterFormData = z.infer<typeof RegisterFormSchema>;
