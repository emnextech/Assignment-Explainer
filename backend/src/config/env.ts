import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    FRONTEND_URL: z.string().url().default("http://localhost:5173"),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    LLM_PROVIDER: z.enum(["gemini", "openai"]).default("gemini"),
    GEMINI_API_KEY: z.string().min(1).optional(),
    GEMINI_MODEL: z.string().min(1).default("gemini-2.5-flash"),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENAI_MODEL: z.string().min(1).default("gpt-5-mini"),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10)
  })
  .superRefine((value, context) => {
    if (value.LLM_PROVIDER === "gemini" && !value.GEMINI_API_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "GEMINI_API_KEY is required when LLM_PROVIDER=gemini.",
        path: ["GEMINI_API_KEY"]
      });
    }

    if (value.LLM_PROVIDER === "openai" && !value.OPENAI_API_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "OPENAI_API_KEY is required when LLM_PROVIDER=openai.",
        path: ["OPENAI_API_KEY"]
      });
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

export const parseEnv = (input: NodeJS.ProcessEnv): AppEnv => envSchema.parse(input);
