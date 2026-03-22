import OpenAI from "openai";

import { env } from "../env.js";

export const createOpenAiClient = () =>
  new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    timeout: env.REQUEST_TIMEOUT_MS
  });
