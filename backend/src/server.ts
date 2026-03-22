import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Assignment Explainer API running on port ${env.PORT}`);
});
