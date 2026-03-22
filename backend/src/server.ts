import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Assignment Explainer API running on port ${env.PORT}`);
});
