import "dotenv/config";

import { parseEnv } from "./config/env";

export const env = parseEnv(process.env);
