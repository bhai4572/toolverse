import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export async function addPdfWatermark(
  file: File,
  watermarkText: string,
  opacity: number = 0.3,
  fontSize: number = 48
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(watermarkText, {
      x: (width - textWidth) / 2,
      y: (height - textHeight) / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  }

  return await pdfDoc.save();
}

export async function addPdfStamp(
  file: File,
  stampType: 'DRAFT' | 'CONFIDENTIAL' | 'APPROVED' | 'PAID' | 'CUSTOM',
  customText?: string
): Promise<Uint8Array> {
  const text = stampType === 'CUSTOM' ? (customText || 'STAMP') : stampType;
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  let stampColor = rgb(0.8, 0.1, 0.1); // Red default
  if (stampType === 'APPROVED' || stampType === 'PAID') {
    stampColor = rgb(0.1, 0.6, 0.2); // Green
  }

  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = 36;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    // Draw stamp border box
    const boxWidth = textWidth + 30;
    const boxHeight = 50;
    const x = width - boxWidth - 30;
    const y = height - boxHeight - 30;

    page.drawRectangle({
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      borderColor: stampColor,
      borderWidth: 3,
      opacity: 0.85,
    });

    page.drawText(text, {
      x: x + 15,
      y: y + 12,
      size: fontSize,
      font,
      color: stampColor,
      opacity: 0.85,
    });
  }

  return await pdfDoc.save();
}

export async function addPdfPageNumbers(
  file: File,
  position: 'bottom-right' | 'bottom-center' | 'top-right' = 'bottom-center'
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const text = `Page ${idx + 1} of ${totalPages}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = (width - textWidth) / 2;
    let y = 20;

    if (position === 'bottom-right') {
      x = width - textWidth - 30;
    } else if (position === 'top-right') {
      x = width - textWidth - 30;
      y = height - 30;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  return await pdfDoc.save();
}
