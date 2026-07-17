import z from "zod";
import { FastifyTypedInstance } from "@/types";
import {
  CheckoutBodySchema,
  CheckoutOnStripe,
} from "./checkout-on-stripe-controller";

export async function usersRoutes(app: FastifyTypedInstance) {
  app.post(
    "/checkout",
    {
      schema: {
        tags: ["users"],
        description: "Create a new checkout on Stripe",
        body: CheckoutBodySchema,
        response: {
          201: z
            .object({
              url: z.string(),
            })
            .describe("Checkout stripe session created."),
          409: z
            .object({
              message: z.string(),
            })
            .describe("Username already exists."),
        },
      },
    },
    CheckoutOnStripe,
  );
}
