import { PDFDocument, degrees } from 'pdf-lib';

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export async function splitPdfFile(
  file: File,
  pageIndicesToExtract: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const validIndices = pageIndicesToExtract.filter(
    (idx) => idx >= 0 && idx < pdf.getPageCount()
  );

  const copiedPages = await newPdf.copyPages(pdf, validIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

export async function rotatePdfPages(
  file: File,
  rotationAngle: 90 | 180 | 270,
  targetPages?: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();

  const pagesToRotate = targetPages
    ? targetPages.filter((idx) => idx >= 0 && idx < totalPages)
    : pdf.getPageIndices();

  pagesToRotate.forEach((pageIdx) => {
    const page = pdf.getPage(pageIdx);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  return await pdf.save();
}

export async function imagesToPdfFile(
  imageFiles: File[],
  pageSize: 'A4' | 'Letter' | 'Fit' = 'A4'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    let embeddedImage;

    if (file.type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    let width = embeddedImage.width;
    let height = embeddedImage.height;

    if (pageSize === 'A4') {
      width = 595.28;
      height = 841.89;
    } else if (pageSize === 'Letter') {
      width = 612.0;
      height = 792.0;
    }

    const page = pdfDoc.addPage([width, height]);

    // Scale image to fit within page dimensions with 20px padding
    const padding = 20;
    const availableW = width - padding * 2;
    const availableH = height - padding * 2;

    const imgAspect = embeddedImage.width / embeddedImage.height;
    const pageAspect = availableW / availableH;

    let drawW = availableW;
    let drawH = availableH;

    if (imgAspect > pageAspect) {
      drawH = availableW / imgAspect;
    } else {
      drawW = availableH * imgAspect;
    }

    const x = (width - drawW) / 2;
    const y = (height - drawH) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawW,
      height: drawH,
    });
  }

  return await pdfDoc.save();
}

export async function reorderPdfPages(
  file: File,
  newOrderIndices: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(originalPdf, newOrderIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}
