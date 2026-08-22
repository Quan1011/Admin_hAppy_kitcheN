import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '../config/r2';

// Read a File/Blob into a Uint8Array. Some AWS SDK v3 versions choke on raw File objects
// in browser bundles ("readableStream.getReader is not a function"), so we hand it bytes
// directly. Cost is negligible because images are already compressed < 1MB upstream.
const readToBytes = async (file) => {
  if (file instanceof ArrayBuffer) return new Uint8Array(file);
  if (file instanceof Uint8Array) return file;
  if (typeof file.arrayBuffer === 'function') {
    const buf = await file.arrayBuffer();
    return new Uint8Array(buf);
  }
  // Last-resort fallback for non-standard inputs.
  if (typeof Blob !== 'undefined' && file instanceof Blob) {
    return new Uint8Array(await file.arrayBuffer());
  }
  throw new Error('Không thể đọc nội dung tệp để upload');
};

// Generate a unique object key. Uses timestamp + random suffix to avoid collisions
// when two uploads happen in the same millisecond.
const generateKey = (file, prefix) => {
  const ext = (file.name?.split('.').pop() || file.type?.split('/').pop() || 'jpg').toLowerCase();
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg'].includes(ext) ? ext : 'jpg';
  const random = Math.random().toString(36).slice(2, 8);
  const ts = Date.now();
  return `${prefix}/${ts}-${random}.${safeExt}`;
};

// Build the publicly-fetchable URL for an object stored under `key`.
// Falls back to a safe empty string if R2_PUBLIC_URL is missing so callers never get "undefined".
const buildPublicUrl = (key) => (R2_PUBLIC_URL ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}` : '');

/**
 * Upload a file to Cloudflare R2.
 * Drop-in replacement for the old uploadToCloudinary() — same signature, same return value (HTTPS URL string).
 */
export const uploadToR2 = async (file, prefix = 'uploads') => {
  if (!R2_BUCKET) {
    throw new Error('VITE_R2_BUCKET chưa được cấu hình');
  }

  const key = generateKey(file, prefix);
  const bytes = await readToBytes(file);

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: file.type || 'image/jpeg',
        ContentLength: bytes.byteLength,
        // Cache aggressively on the public CDN so repeat views are cheap.
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return buildPublicUrl(key);
  } catch (error) {
    console.error('Lỗi upload R2:', error);
    throw error;
  }
};

/**
 * Delete an object from R2 given either the full public URL or just the object key.
 * Silently no-ops on invalid input so callers don't have to guard against undefined URLs.
 */
export const deleteFromR2 = async (urlOrKey) => {
  if (!urlOrKey || !R2_BUCKET) return;

  let key = urlOrKey;
  if (R2_PUBLIC_URL && urlOrKey.startsWith(R2_PUBLIC_URL)) {
    key = urlOrKey.slice(R2_PUBLIC_URL.replace(/\/$/, '').length).replace(/^\//, '');
  }

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );
  } catch (error) {
    // Treat deletion failures as non-fatal — the orphaned object can be cleaned up later.
    console.error('Lỗi xóa R2:', error);
  }
};

// Backwards-compatible alias for code that still references the old Cloudinary name.
export const uploadToCloudinary = uploadToR2;