import { fastifyCors } from "@fastify/cors";
import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import z, { ZodError } from "zod";

import { env } from "./env";
import { appRoutes } from "./http/routes";

import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyRawBody from "fastify-raw-body";

export const app = fastify({
  logger:
    env.NODE_ENV === "dev" ? { transport: { target: "pino-pretty" } } : true,
  trustProxy: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST"],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Typed API",
      description:
        "API Restful Jellyfin Stripe Gateway for management of payments.",
      version: "1.0.0",
      contact: {
        name: "Henrique Maximo",
        email: "Henrrylimadasilva@gmail.com",
        url: "https://www.linkedin.com/in/henrique-maximo/",
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(fastifyRawBody, {
  global: false, // só ativa nas rotas que pedirem
  encoding: false, // mantém como Buffer
});

app.register(appRoutes);

app.setErrorHandler(
  (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: "Validation error.", issues: z.treeifyError(error) });
    }

    if (env.NODE_ENV !== "production") {
      console.log(error);
    } else {
      // TODO: Here we should log to on external tool like DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({ message: "Internal server error." });
  },
);
