# Jelly Stripe Gateway

**Jelly Stripe Gateway** é um gateway de integração leve, moderno e open-source projetado para automatizar a criação de contas no **Jellyfin** através de assinaturas do **Stripe**.
![alt text](logo.png) 
- Ideal para administradores de servidores *self-hosted* que desejam automatizar o acesso de usuários e gerenciar cobranças de forma profissional e sem processos manuais.

## Fluxo da Aplicação (operação)

O sistema funciona de forma assíncrona para garantir a segurança dos dados e que nenhuma conta seja criada sem a confirmação do pagamento:

```
[ Usuário ] ➔ Preenche cadastro no Front-end (Vite)
                              │
                              ▼
[ Back-end (Fastify) ] ➔ Gera token UUID, armazena dados no Redis com TTL de 1h
                              │
                              ▼
[ Stripe Checkout ] ➔ Usuário realiza o pagamento (Cartão ou Pix)
                              │
                              ▼ 
[ Back-end (Fastify) ] ➔ Valida assinatura, lê token do metadata, busca dados no Redis
                              │
                              ▼
[ API do Jellyfin ] ➔ Cria a conta ativa no servidor automaticamente 
                              │
                              ▼ 
[ Redis ] ➔ Token invalidado imediatamente após criação da conta
```

## Ferramental de Desenvolvimento

* **Front-end:** React, Vite, TypeScript, Tailwind CSS
* **Back-end:** Node.js, Fastify, TypeScript, Stripe SDK, Swagger, Zod, Vitest, Redis Cache (via Docker)
* **Integração:** Jellyfin REST API

## Como configurar

## Como rodar localmente

## Segurança
- **Token UUID temporário:** Dados sensíveis nunca trafegam no metadata do Stripe. Um token UUID é gerado no checkout, os dados ficam no Redis com TTL de 1 hora e apenas o token vai para o Stripe para que o webhook do Stripe possa enviar.
- **Validação de Webhook:** O endpoint valida rigorosamente a assinatura de cada webhook recebido do Stripe, impedindo requisições falsas.
- **Idempotência:** O token é deletado do Redis imediatamente após a criação da conta, garantindo que reenvios do mesmo evento não criem contas duplicadas.
- **Rate Limiting:** A API possui limite de requisições por IP para proteção contra abuso e ataques DDoS.

## RFs (requisitos funcionais)

- [x] O usuário deve poder realizar checkout na plataforma para pagamento
- [x] O sistema deve redirecionar o usuário para o Stripe Checkout após o cadastro
- [x] O sistema deve criar a conta no Jellyfin automaticamente após confirmação do pagamento
- [x] O usuário deve ser redirecionado para uma página de sucesso/cancelamento após o checkout

## RNFs (requisitos não-funcionais)

- [x] A API deve validar a assinatura do webhook do Stripe antes de processar qualquer evento
- [x] Dados sensíveis do usuário não devem trafegar em texto puro nos metadados do Stripe
- [x] O sistema deve utilizar Redis como cache temporário para os dados do usuário
- [ ] O sistema deve ter um job de polling para reprocessar pagamentos não processados pelo webhook

## Regra de negócio

- [x] A conta no Jellyfin só deve ser criada após confirmação de pagamento pelo Stripe
- [x] Apenas um plano mensal deve estar disponível para assinatura
- [x] O sistema não deve criar contas duplicadas no Jellyfin para o mesmo username
- [x] Os dados sensíveis devem ser armazenados no Redis com TTL de 1 hora vinculados a um token UUID
- [x] O token deve trafegar no metadata do Stripe no lugar dos dados sensíveis
- [x] O token deve ser invalidado imediatamente após a criação da conta ou expiração do TTL
- [x] O sistema não deve reprocessar um evento já processado (idempotência)

Desenvolvido com ☕ e TypeScript. Sinta-se livre para abrir Issues ou enviar Pull Requests!
