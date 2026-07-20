import nodeCron from "node-cron";
import { app } from "./app";
import { env } from "./env";
import { pollingOnStripeJob } from "./jobs/stripe/polling-on-stripe-job";

// Jobs Polling Stripe (15 em 15 minutos)
nodeCron.schedule("*/15 * * * *", pollingOnStripeJob);

app
  .listen({
    host: "0.0.0.0", // acesso externo
    port: env.PORT, // porta
  })
  .then(() => {
    console.log("HTTP Server Running! 🚀");
  });
