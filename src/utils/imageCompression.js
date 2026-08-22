import imageCompression from 'browser-image-compression';

const KB = 1024;
const MB = KB * 1024;

const DEFAULT_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.82,
  fileType: 'image/webp',
};

const DISH_OPTIONS = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  initialQuality: 0.8,
  fileType: 'image/webp',
};

const logCompression = (label, file, compressed) => {
  const before = (file.size / MB).toFixed(2);
  const after = (compressed.size / MB).toFixed(2);
  const ratio = ((1 - compressed.size / file.size) * 100).toFixed(0);
  console.info(
    `[imageCompression:${label}] ${file.name} ${before}MB → ${after}MB (-${ratio}%)`
  );
};

export const compressImage = async (file, options = {}) => {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Tệp không phải định dạng ảnh');
  }

  // Already small enough → skip
  if (file.size <= 200 * KB) {
    return file;
  }

  const merged = { ...DEFAULT_OPTIONS, ...options };
  try {
    const compressed = await imageCompression(file, merged);
    logCompression('default', file, compressed);
    return compressed;
  } catch (error) {
    console.warn('Nén ảnh thất bại, dùng file gốc:', error);
    return file;
  }
};

export const compressHeroImage = async (file) =>
  compressImage(file, DEFAULT_OPTIONS);

export const compressDishImage = async (file) =>
  compressImage(file, DISH_OPTIONS);