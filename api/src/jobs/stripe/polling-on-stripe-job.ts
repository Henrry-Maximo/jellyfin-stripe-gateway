import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { stripe } from "@/lib/stripe";

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

export async function pollingOnStripeJob() {
  const { data } = await stripe.checkout.sessions.list({
    limit: 100,
    status: "complete", // pagas, mas não processadas
    created: {
      gte: Math.floor(Date.now() / 1000) - 60 * 60 * 2, // sessões criadas nas últimas 2 horas
    },
  });

  const unprocessed = data.filter(
    (session) => session.payment_status === "paid" && session.metadata?.token,
  );

  for (const session of unprocessed) {
    const token = session.metadata?.token!;
    const data = await redisClient.get(token);
    // console.log(token);

    if (!data) continue;

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

    await redisClient.del(token);
  }
}
