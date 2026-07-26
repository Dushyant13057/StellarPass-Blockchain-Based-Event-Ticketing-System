import { Horizon } from '@stellar/stellar-sdk';

const horizonUrl = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
export const stellarServer = new Horizon.Server(horizonUrl);
export const STELLAR_NETWORK_PASSPHRASE = 'Test SDF Network ; July 2015';
