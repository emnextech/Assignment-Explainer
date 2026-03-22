import "dotenv/config";

import { parseEnv } from "./config/env.js";

export const env = parseEnv(process.env);
