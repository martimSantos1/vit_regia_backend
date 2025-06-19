import { z } from 'zod';

export const dataDTO = z.object({
  temperature: z.number().min(-50).max(100),
  ph: z.number().min(0).max(14),
  turbidity: z.number().min(0).max(1000),
  tds: z.number().min(0).max(1000),
  conductivity: z.number().min(0).max(1000),
  dissolvedOxygen: z.number().min(0).max(20),
});

export type DataDTO = z.infer<typeof dataDTO>;