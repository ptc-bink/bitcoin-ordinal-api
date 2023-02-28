import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyPluginAsync } from 'fastify';
import { Server } from 'http';
import FastifyCors from '@fastify/cors';
import { PINO_CONFIG } from '../logger';
import { SwaggerOptions } from '@fastify/swagger';
import { InscriptionsRoutes } from './routes/inscriptions';
import { PgStore } from '../pg/pg-store';
import { SatRoutes } from './routes/sats';

export const ApiSwaggerOptions: SwaggerOptions = {
  openapi: {
    info: {
      title: 'Ordinals API',
      description:
        'A microservice that indexes Bitcoin Ordinal inscription data and exposes it via REST API endpoints.',
      version: 'v0.0.1',
    },
    externalDocs: {
      url: 'https://github.com/hirosystems/ordinals-api',
      description: 'Source Repository',
    },
    tags: [
      {
        name: 'Inscriptions',
        description: 'Endpoints to query ordinal inscriptions',
      },
      {
        name: 'Satoshis',
        description: 'Endpoints to query Satoshi ordinal and rarity information',
      },
    ],
  },
};

export const Api: FastifyPluginAsync<
  Record<never, never>,
  Server,
  TypeBoxTypeProvider
> = async fastify => {
  await fastify.register(InscriptionsRoutes);
  await fastify.register(SatRoutes);
};

export async function buildApiServer(args: { db: PgStore }) {
  const fastify = Fastify({
    trustProxy: true,
    logger: PINO_CONFIG,
  }).withTypeProvider<TypeBoxTypeProvider>();

  fastify.decorate('db', args.db);
  await fastify.register(FastifyCors);
  await fastify.register(Api, { prefix: '/ordinals/v1' });
  await fastify.register(Api, { prefix: '/ordinals' });

  return fastify;
}
