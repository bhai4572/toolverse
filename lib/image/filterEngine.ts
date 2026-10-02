export interface ImageFilterOptions {
  brightness?: number; // 0 to 200 (100 is normal)
  contrast?: number; // 0 to 200 (100 is normal)
  saturation?: number; // 0 to 200 (100 is normal)
  grayscale?: boolean;
  blur?: number; // px
  pixelate?: number; // block size px
}

export async function applyImageFilters(
  file: File,
  options: ImageFilterOptions
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas error');

  let filterStr = '';
  if (options.brightness !== undefined) filterStr += `brightness(${options.brightness}%) `;
  if (options.contrast !== undefined) filterStr += `contrast(${options.contrast}%) `;
  if (options.saturation !== undefined) filterStr += `saturate(${options.saturation}%) `;
  if (options.grayscale) filterStr += `grayscale(100%) `;
  if (options.blur) filterStr += `blur(${options.blur}px) `;

  ctx.filter = filterStr.trim() || 'none';
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Filter application failed'));
    }, file.type || 'image/jpeg', 0.92);
  });
}

export async function extractDominantColor(file: File): Promise<{ hex: string; rgb: string }> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = 50;
  canvas.height = 50;
  const ctx = canvas.getContext('2d');

  if (!ctx) return { hex: '#ffffff', rgb: 'rgb(255,255,255)' };
  ctx.drawImage(img, 0, 0, 50, 50);

  const imgData = ctx.getImageData(0, 0, 50, 50).data;
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < imgData.length; i += 16) {
    r += imgData[i];
    g += imgData[i + 1];
    b += imgData[i + 2];
    count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  return { hex, rgb: `rgb(${r}, ${g}, ${b})` };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
