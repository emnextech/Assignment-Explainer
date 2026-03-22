import OpenAI from "openai";

import { env } from "../env";

export const createOpenAiClient = () =>
  new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    timeout: env.REQUEST_TIMEOUT_MS
  });
