import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PRICE_ID: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  JELLYFIN_URL: z.string(),
  JELLYFIN_API_KEY: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
