import { buildApiServer } from '../src/api/init';
import { ENV } from '../src/env';
import { cycleMigrations } from '../src/pg/migrations';
import { PgStore } from '../src/pg/pg-store';
import { TestFastifyServer } from './helpers';

describe('ETag cache', () => {
  let db: PgStore;
  let fastify: TestFastifyServer;

  beforeEach(async () => {
    ENV.PGDATABASE = 'postgres';
    db = await PgStore.connect({ skipMigrations: true });
    fastify = await buildApiServer({ db });
    await cycleMigrations();
  });

  afterEach(async () => {
    await fastify.close();
    await db.close();
  });

  test('inscription cache control', async () => {
    await db.insertInscriptionGenesis({
      inscription: {
        genesis_id: '38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dci0',
        mime_type: 'image/png',
        content_type: 'image/png',
        content_length: 5,
        content: '0x48656C6C6F',
        fee: 2805n,
      },
      location: {
        inscription_id: 0,
        block_height: 775617,
        block_hash: '00000000000000000002a90330a99f67e3f01eb2ce070b45930581e82fb7a91d',
        tx_id: '38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dc',
        address: 'bc1p3cyx5e2hgh53w7kpxcvm8s4kkega9gv5wfw7c4qxsvxl0u8x834qf0u2td',
        output: '38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dc:0',
        offset: 0n,
        value: 10000n,
        timestamp: 1676913207,
        sat_ordinal: 257418248345364n,
        sat_rarity: 'common',
        genesis: true,
        current: true,
      },
    });
    const response = await fastify.inject({
      method: 'GET',
      url: '/inscriptions/38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dci0',
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers.etag).not.toBeUndefined();
    const etag = response.headers.etag;

    // Cached response
    const cached = await fastify.inject({
      method: 'GET',
      url: '/inscriptions/38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dci0',
      headers: { 'if-none-match': etag },
    });
    expect(cached.statusCode).toBe(304);

    // Simulate modified location and check status code
    await db.sql`UPDATE locations SET timestamp = NOW() WHERE true`;
    const cached2 = await fastify.inject({
      method: 'GET',
      url: '/inscriptions/38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dci0',
      headers: { 'if-none-match': etag },
    });
    expect(cached2.statusCode).toBe(200);
  });
});
