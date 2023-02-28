import { Static, TSchema, Type } from '@sinclair/typebox';
import { SatoshiRarity, SAT_SUPPLY } from './util/ordinal-satoshi';

export const AddressParam = Type.String({
  title: 'Address',
  description: 'Bitcoin address',
  examples: ['bc1p8aq8s3z9xl87e74twfk93mljxq6alv4a79yheadx33t9np4g2wkqqt8kc5'],
});

export const InscriptionIdRegEx = /^[a-fA-F0-9]{64}i[0-9]+$/;
export const InscriptionIdParam = Type.RegEx(InscriptionIdRegEx, {
  title: 'Inscription ID',
  description: 'Inscription unique identifier',
  examples: ['38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dci0'],
});

export const OrdinalParam = Type.Integer({
  title: 'Ordinal Number',
  description: 'Ordinal number that uniquely identifies a satoshi',
  examples: [257418248345364],
  minimum: 0,
  exclusiveMaximum: SAT_SUPPLY,
});

export const BlockHeightParam = Type.RegEx(/^[0-9]+$/, {
  title: 'Block Height',
  description: 'Bitcoin block height',
  examples: [777678],
});

export const BlockHashParam = Type.RegEx(/^[0]{8}[a-fA-F0-9]{56}$/, {
  title: 'Block Hash',
  description: 'Bitcoin block hash',
  examples: ['0000000000000000000452773967cdd62297137cdaf79950c5e8bb0c62075133'],
});

export const MimeTypeParam = Type.RegEx(/^\w+\/[-.\w]+(?:\+[-.\w]+)?$/, {
  title: 'MIME Type',
  description: 'MIME type for an inscription content',
  examples: ['image/png'],
});

export const SatoshiRarityParam = Type.Enum(SatoshiRarity, {
  title: 'Rarity',
  description: 'Rarity of a single satoshi according to Ordinal Theory',
  examples: ['uncommon'],
});

export const OutputParam = Type.RegEx(/^[a-fA-F0-9]{64}:[0-9]+$/, {
  title: 'Transaction Output',
  description: 'An UTXO for a Bitcoin transaction',
  examples: ['8f46f0d4ef685e650727e6faf7e30f23b851a7709714ec774f7909b3fb5e604c:0'],
});

export const OffsetParam = Type.Integer({
  minimum: 0,
  title: 'Offset',
  description: 'Result offset',
});

export const LimitParam = Type.Integer({
  minimum: 1,
  maximum: 20,
  title: 'Limit',
  description: 'Results per page',
});

export enum OrderBy {
  genesis_block_height = 'genesis_block_height',
  ordinal = 'ordinal',
  rarity = 'rarity',
}
export const OrderByParam = Type.Enum(OrderBy, {
  title: 'Order By',
  description: 'Parameter to order results by',
});

export enum Order {
  asc = 'asc',
  desc = 'desc',
}
export const OrderParam = Type.Enum(Order, {
  title: 'Order',
  description: 'Results order',
});

export const PaginatedResponse = <T extends TSchema>(type: T) =>
  Type.Object({
    limit: Type.Integer(),
    offset: Type.Integer(),
    total: Type.Integer(),
    results: Type.Array(type),
  });

export const InscriptionResponse = Type.Object({
  id: Type.String(),
  number: Type.Integer(),
  address: Type.String(),
  genesis_block_height: Type.Integer(),
  genesis_block_hash: Type.String(),
  genesis_tx_id: Type.String(),
  genesis_fee: Type.String(),
  location: Type.String(),
  output: Type.String(),
  offset: Type.String(),
  sat_ordinal: Type.String(),
  sat_rarity: Type.String(),
  mime_type: Type.String(),
  content_type: Type.String(),
  content_length: Type.Integer(),
  timestamp: Type.Integer(),
});
export type InscriptionResponseType = Static<typeof InscriptionResponse>;

export const SatoshiResponse = Type.Object({
  coinbase_height: Type.Integer(),
  cycle: Type.Integer(),
  decimal: Type.String(),
  degree: Type.String(),
  inscription_id: Type.Optional(Type.String()),
  epoch: Type.Number(),
  name: Type.String(),
  offset: Type.Number(),
  percentile: Type.String(),
  period: Type.Integer(),
  rarity: Type.Enum(SatoshiRarity),
  // timestamp: Type.Integer(),
});

export const NotFoundResponse = Type.Object({
  error: Type.Literal('Not found'),
});
