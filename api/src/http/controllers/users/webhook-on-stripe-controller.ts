import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { FastifyReply, FastifyRequest } from "fastify";

export async function WebhookOnStripe(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody as Buffer,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return reply.status(400).send({ message: "Invalid webhook signature." });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { email, username, password } = session.metadata!;

    // TODO: criar usuário no Jellyfin com email, username, password
    console.log({ email, username, password });
  }

  return reply.status(200).send();
}
