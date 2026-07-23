# Jelly Gateway

**Jelly Gateway** é um gateway de integração leve, moderno e open-source projetado para automatizar a criação de contas no Jellyfin através de pagamentos online utilizando Stripe (cartão de crédito) ou Mercado Pago (PIX).
- Ideal para administradores de servidores *self-hosted* que desejam automatizar o acesso de usuários e gerenciar cobranças de forma profissional e sem processos manuais.
![alt text](logo.png) 

## Fluxo da Aplicação (operação)

A aplicação foi construída utilizando uma arquitetura orientada a eventos, funcionando de forma assíncrona para garantir a segurança dos dados e que nenhuma conta seja criada sem a confirmação do pagamento:

```
[ Usuário ] ➔ Preenche cadastro no Front-end (Vite)
                              │
                              ▼
[ Back-end (Fastify) ] ➔ Gera token UUID, armazena dados no Redis com TTL de 1h
                              │
                              ▼
[ Stripe / Mercado Pago Checkout ] ➔ Usuário realiza o pagamento (Cartão / Pix)
                              │
                              ▼ 
[ Back-end (Fastify) ] ➔ Persiste o usuário no banco, estabelece gateway utilizado, identificador do usuário, e customerId via token no redis (para que webhook consiga localizar)
                              │
                              ▼ 
[ Back-end (Fastify) - Webhook ] ➔ Valida assinatura, lê token do metadata, busca dados no Redis utilizando o customerId, atualiza o status e cria usuário no Jellyfin estabelecendo seu identificador no banco
                              │
                              ▼
[ API do Jellyfin ] ➔ Cria a conta ativa no servidor automaticamente
                              │
                              ▼ 
[ Redis ] ➔ Token invalidado imediatamente após criação da conta
```

```schema
users: [
  id,
  customerId,
  gateway,
  method,
  status,
  id_jellyfin,
  createAt,
  updateAt,
]
```

## Ferramental de Desenvolvimento

* **Front-end:** React, Vite, TypeScript, Tailwind CSS
* **Back-end:** Node.js, Fastify, TypeScript, Stripe SDK, Swagger, Zod, Vitest, Redis Cache (via Docker)
* **Integração:** Jellyfin REST API, Stripe API

## Como configurar

## Como rodar localmente

## Segurança
- **Token UUID temporário:** Dados sensíveis nunca trafegam no metadata do Stripe. Um token UUID é gerado no checkout, os dados ficam no Redis com TTL de 1 hora e apenas o token vai para o Stripe para que o webhook do Stripe possa enviar.
- **Validação de Webhook:** O endpoint valida rigorosamente a assinatura de cada webhook recebido do Stripe, impedindo requisições falsas.
- **Idempotência:** O token é deletado do Redis imediatamente após a criação da conta, garantindo que reenvios do mesmo evento não criem contas duplicadas.
- **Rate Limiting:** A API possui limite de requisições por IP para proteção contra abuso e ataques DDoS.
- **Polling:** Caso algum webhook não seja entregue (timeout, indisponibilidade da API, etc.), um processo de polling consulta periodicamente o Stripe procurando sessões aprovadas nas últimas horas. Se existir um token correspondente ainda presente no Redis, o pagamento é processado normalmente.

# V1

## RFs (requisitos funcionais)

- [x] O usuário deve poder realizar checkout na plataforma para pagamento
- [x] O sistema deve redirecionar o usuário para o Stripe Checkout após o cadastro
- [x] O sistema deve criar a conta no Jellyfin automaticamente após confirmação do pagamento
- [x] O usuário deve ser redirecionado para uma página de sucesso/cancelamento após o checkout

## RNFs (requisitos não-funcionais)

- [x] A API deve validar a assinatura do webhook do Stripe antes de processar qualquer evento
- [x] Dados sensíveis do usuário não devem trafegar em texto puro nos metadados do Stripe
- [x] O sistema deve utilizar Redis como cache temporário para os dados do usuário
- [x] O sistema deve ter um job de polling para reprocessar pagamentos não processados pelo webhook

## Regra de negócio

- [x] A conta no Jellyfin só deve ser criada após confirmação de pagamento pelo Stripe
- [x] Apenas um plano mensal deve estar disponível para assinatura
- [x] O sistema não deve criar contas duplicadas no Jellyfin para o mesmo username
- [x] Os dados sensíveis devem ser armazenados no Redis com TTL de 1 hora vinculados a um token UUID
- [x] O token deve trafegar no metadata do Stripe no lugar dos dados sensíveis
- [x] O token deve ser invalidado imediatamente após a criação da conta ou expiração do TTL
- [x] O sistema não deve reprocessar um evento já processado (idempotência)

# V2

Está etapa de desenvolvimento altera diretamente a arquitetura do projeto, passando adotar um banco físico para persistência dos dados relacionados aos usuários do serviço Jelly Gateway.

## RFs (requisitos funcionais)

- [ ]

## RNFs (requisitos não-funcionais)

- [ ]

## Regra de negócio

- [ ]

Desenvolvido com ☕ e TypeScript. Sinta-se livre para abrir Issues ou enviar Pull Requests!
