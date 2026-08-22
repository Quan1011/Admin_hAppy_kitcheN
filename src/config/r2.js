import { S3Client } from '@aws-sdk/client-s3';

// R2 requires region "auto" and a custom endpoint pointing to the account-specific R2 host.
// Endpoint hostname is the one shown in the R2 dashboard for this account.
// Public delivery URL is separate — used to build the public URL returned to callers.
export const R2_ENDPOINT = import.meta.env.VITE_R2_ENDPOINT;
export const R2_BUCKET = import.meta.env.VITE_R2_BUCKET;
export const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;

if (!R2_ENDPOINT || !R2_BUCKET || !R2_PUBLIC_URL || !accessKeyId || !secretAccessKey) {
  // Surface a clear error early so misconfiguration isn't silently swallowed by AWS SDK.
  console.error(
    '[r2] Missing one of VITE_R2_ENDPOINT / VITE_R2_BUCKET / VITE_R2_PUBLIC_URL / VITE_R2_ACCESS_KEY_ID / VITE_R2_SECRET_ACCESS_KEY'
  );
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  // R2 does not support some SigV4 path-style quirks; forcePathStyle is safer with custom endpoints.
  forcePathStyle: true,
});