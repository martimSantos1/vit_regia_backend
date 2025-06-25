import { z } from 'zod';

export const dataDTO = z.object({
  temperature: z.number().min(-50).max(100),
  ph: z.number().min(0).max(14),
  turbidity: z.number().min(0).max(1000),
  tds: z.number().min(0).max(1000),
  conductivity: z.number().min(0).max(1000),
  dissolvedOxygen: z.number().min(0).max(20),
  timestamp: z.string().datetime().optional(),
  temperatureStatus: z.enum(['good', 'alarming', 'critical']).optional(),
  phStatus: z.enum(['good', 'alarming', 'critical']).optional(),
  turbidityStatus: z.enum(['good', 'alarming', 'critical']).optional(),
  tdsStatus: z.enum(['good', 'alarming', 'critical']).optional(),
  conductivityStatus: z.enum(['good', 'alarming', 'critical']).optional(),
  dissolvedOxygenStatus: z.enum(['good', 'alarming', 'critical']).optional()
});

export type DataDTO = z.infer<typeof dataDTO>;