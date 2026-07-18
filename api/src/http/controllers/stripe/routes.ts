import z from "zod";
import { FastifyTypedInstance } from "@/types";
import { WebhookOnStripe } from "./webhook-on-stripe-controller";
import { rateLimiter } from "@/http/middlewares/rate-limiter";

export async function stripeRoutes(app: FastifyTypedInstance) {
  app.post(
    "/webhook",
    {
      preHandler: [rateLimiter],
      config: { rawBody: true },
      schema: {
        tags: ["stripe"],
        description: "Receive Stripe webhook event",
        response: {
          200: z.object({}).describe("Event received."),
        },
      },
    },
    WebhookOnStripe,
  );
}
