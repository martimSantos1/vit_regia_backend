import { z } from 'zod';

export const dataDTO = z.object({
  temperature: z.number().min(-50).max(100),
  ph: z.number().min(0).max(100),
});

export type DataDTO = z.infer<typeof dataDTO>;