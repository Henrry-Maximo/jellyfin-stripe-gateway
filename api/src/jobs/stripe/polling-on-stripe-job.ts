import { stripe } from "@/lib/stripe";

export async function pollingOnStripeJob() {
  const response = await stripe.checkout.sessions.list({
    limit: 100,
    status: "complete", // pagas, mas não processadas
  });
}
