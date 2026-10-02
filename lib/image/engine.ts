import imageCompression from 'browser-image-compression';

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
  backgroundColor?: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SOCIAL_PRESETS = [
  { id: 'insta-square', name: 'Instagram Square Post', width: 1080, height: 1080, platform: 'Instagram' },
  { id: 'insta-portrait', name: 'Instagram Portrait Post', width: 1080, height: 1350, platform: 'Instagram' },
  { id: 'insta-story', name: 'Instagram Story / Reel', width: 1080, height: 1920, platform: 'Instagram' },
  { id: 'yt-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'YouTube' },
  { id: 'yt-banner', name: 'YouTube Channel Banner', width: 2560, height: 1440, platform: 'YouTube' },
  { id: 'fb-cover', name: 'Facebook Page Cover', width: 1200, height: 628, platform: 'Facebook' },
  { id: 'fb-profile', name: 'Facebook Profile Picture', width: 600, height: 600, platform: 'Facebook' },
  { id: 'linkedin-banner', name: 'LinkedIn Company Banner', width: 1584, height: 396, platform: 'LinkedIn' },
  { id: 'linkedin-profile', name: 'LinkedIn Profile Picture', width: 400, height: 400, platform: 'LinkedIn' },
  { id: 'twitter-header', name: 'X / Twitter Header', width: 1500, height: 500, platform: 'X / Twitter' },
  { id: 'twitter-post', name: 'X / Twitter Post Image', width: 1200, height: 675, platform: 'X / Twitter' },
  { id: 'tiktok-profile', name: 'TikTok Profile Picture', width: 200, height: 200, platform: 'TikTok' },
];

export const PASSPORT_PRESETS = [
  { id: 'us-2x2', name: 'US / Pakistan Passport (2x2 inch)', widthPx: 600, heightPx: 600, aspect: '1:1' },
  { id: 'schengen-35x45', name: 'Schengen / Europe Visa (35x45 mm)', widthPx: 413, heightPx: 531, aspect: '35:45' },
  { id: 'india-passport', name: 'India Passport (35x35 mm)', widthPx: 413, heightPx: 413, aspect: '1:1' },
];

export async function compressImageFile(
  file: File,
  maxSizeMB: number = 2,
  quality: number = 0.8
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: quality,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.warn('Fallback to canvas compression:', error);
    return await canvasCompressFallback(file, quality);
  }
}

export async function compressToTargetKB(file: File, targetKB: number): Promise<Blob> {
  const targetBytes = targetKB * 1024;
  let minQuality = 0.05;
  let maxQuality = 0.95;
  let bestBlob: Blob | null = null;

  const img = await loadImageFromFile(file);

  for (let i = 0; i < 7; i++) {
    const midQuality = (minQuality + maxQuality) / 2;
    const blob = await canvasToBlob(img, img.width, img.height, 'image/jpeg', midQuality);

    if (!blob) break;

    bestBlob = blob;
    if (blob.size > targetBytes) {
      maxQuality = midQuality;
    } else {
      minQuality = midQuality;
    }
  }

  if (!bestBlob) {
    throw new Error('Failed to compress image to target size.');
  }

  return bestBlob;
}

export async function resizeImageFile(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality: number = 0.9,
  backgroundColor: string = '#ffffff'
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  if (format === 'image/jpeg' || backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas blob generation failed'));
      },
      format,
      quality
    );
  });
}

export async function cropImageFile(
  file: File,
  cropArea: CropArea,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg'
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context error');

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Crop to blob failed'));
      },
      format,
      0.95
    );
  });
}

export async function convertImageFormat(
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.9,
  bgColor: string = '#ffffff'
): Promise<Blob> {
  if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
    try {
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({
        blob: file,
        toType: targetFormat,
        quality,
      });
      return Array.isArray(converted) ? converted[0] : converted;
    } catch (e) {
      console.warn('heic2any failed, fallback canvas:', e);
    }
  }

  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context error');

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Format conversion failed'));
      },
      targetFormat,
      quality
    );
  });
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

function canvasToBlob(
  img: HTMLImageElement,
  w: number,
  h: number,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(null);
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function canvasCompressFallback(file: File, quality: number): Promise<File> {
  const img = await loadImageFromFile(file);
  const blob = await canvasToBlob(img, img.width, img.height, file.type || 'image/jpeg', quality);
  if (!blob) return file;
  return new File([blob], file.name, { type: file.type });
}
