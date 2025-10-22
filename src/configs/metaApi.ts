import MetaApi from 'metaapi.cloud-sdk/esm-node';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.METAAPI_KEY) {
  throw new Error('Meta API token cannot be found. Ensure it is defined on env file');
}

// Initialise MetaAPI instance
export const metaApi = new MetaApi(process.env.METAAPI_KEY);