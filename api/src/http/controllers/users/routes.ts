import z from "zod";
import { FastifyTypedInstance } from "@/types";
import { CheckoutOnStripe } from "./checkout-on-stripe-controller";
import { WebhookOnStripe } from "./webhook-on-stripe-controller";

export async function usersRoutes(app: FastifyTypedInstance) {
  app.post(
    "/checkout",
    {
      schema: {
        tags: ["users"],
        description: "Create a new checkout of user on Stripe",
        body: z.object({
          email: z.email(),
          username: z.string().max(38),
          password: z.string().min(4).max(32),
        }),
        response: {
          201: z
            .object({
              url: z.string(),
            })
            .describe("Checkout Stripe Session created."),
        },
      },
    },
    CheckoutOnStripe,
  );

  app.post(
    "/webhook",
    {
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
