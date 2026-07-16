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
    const { username, password } = session.metadata!;

    const response = await fetch(`${env.JELLYFIN_URL}/Users/New`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `MediaBrowser Token="${env.JELLYFIN_API_KEY}"`,
      },
      body: JSON.stringify({ Name: username, Password: password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erro na criação do usuário: ${response.status} - ${errorText}`,
      );
    }
  }

  return reply.status(200).send();
}
