import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { stripe } from "@/lib/stripe";

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

    await redisClient.del(token);
  }
}
