import { z } from 'zod';

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    price: z.number(),
    quantity: z.number().int().positive()
  })).min(1),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine: z.string()
  }),
  total: z.number().positive(),
  paymentMethod: z.string()
});
