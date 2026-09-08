import sharp from 'sharp';

const ANTHROPIC_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const TARGET_MAX_BYTES = 8 * 1024 * 1024;
const INITIAL_MAX_EDGE = 2048;
const LEFT_COLUMN_RATIO = 0.55;

export type PreparedTherapyImportImage = {
  buffer: Buffer;
  mimeType: 'image/jpeg';
};

/**
 * Crops the left homework column, then downscales/JPEG-compresses for Anthropic vision.
 */
export const prepareTherapyImportImage = async (
  input: Buffer,
): Promise<PreparedTherapyImportImage> => {
  const cropped = await cropLeftHomeworkColumn(input);
  let maxEdge = INITIAL_MAX_EDGE;
  let quality = 82;
  let output = await encodeJpeg(cropped, maxEdge, quality);

  while (output.length > TARGET_MAX_BYTES && (maxEdge > 720 || quality > 40)) {
    if (quality > 50) {
      quality -= 12;
    } else {
      maxEdge = Math.floor(maxEdge * 0.75);
    }
    output = await encodeJpeg(cropped, maxEdge, quality);
  }

  if (output.length > ANTHROPIC_MAX_IMAGE_BYTES) {
    throw new Error('Photo is too large for vision after compression. Try a smaller crop.');
  }

  console.log(
    `✅ prepareTherapyImportImage: ${input.length} bytes → ${output.length} bytes (jpeg q${quality} edge ${maxEdge})`,
  );

  return { buffer: output, mimeType: 'image/jpeg' };
};

const cropLeftHomeworkColumn = async (input: Buffer): Promise<Buffer> => {
  const rotated = await sharp(input).rotate().toBuffer();
  const meta = await sharp(rotated).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < 2 || height < 2) {
    return rotated;
  }
  const cropWidth = Math.max(1, Math.floor(width * LEFT_COLUMN_RATIO));
  return sharp(rotated)
    .extract({ left: 0, top: 0, width: cropWidth, height })
    .toBuffer();
};

const encodeJpeg = async (input: Buffer, maxEdge: number, quality: number): Promise<Buffer> => {
  return sharp(input)
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
};
