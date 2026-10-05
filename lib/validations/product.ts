import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  categoryId: z.string(),
  stock: z.number().int().nonnegative(),
  brand: z.string().optional(),
  description: z.string().optional()
});
