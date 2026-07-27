import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import { FastifyReply, FastifyRequest } from "fastify";

interface JellyfinPolicy {
  EnableContentDownloading?: boolean;
  MaxActiveSessions?: number;
  AuthenticationProviderId?: string;
  PasswordResetProviderId?: string;
  [key: string]: unknown;
}

interface UsersJellyfinResponse {
  Id: string;
  Name: string;
  Policy: JellyfinPolicy;
}

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
    const { token } = session.metadata! as { token: string };
    // console.log("chave: ", token);

    const data = await redisClient.get(token);

    if (!data) {
      return reply.status(200).send();
    }

    const { username, password } = JSON.parse(data);
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

    const { Id, Policy } = (await response.json()) as UsersJellyfinResponse;

    // atualizar a Policy mesclando com a Policy retornada na criação
    const policyResponse = await fetch(
      `${env.JELLYFIN_URL}/Users/${Id}/Policy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `MediaBrowser Token="${env.JELLYFIN_API_KEY}"`,
        },
        body: JSON.stringify({
          ...Policy,
          EnableContentDownloading: false,
          MaxActiveSessions: 3,
        }),
      },
    );

    if (!policyResponse.ok) {
      const policyError = await policyResponse.text();
      throw new Error(
        `Erro ao atualizar policy do usuário: ${policyResponse.status} - ${policyError}`,
      );
    }

    await redisClient.del(token); // elimina o token do redis para evitar reprocessamento (idempotência)
  }

  return reply.status(200).send();
}
