import AdmZip from 'adm-zip';

const MAX_ZIP_ENTRIES = 50;
const MAX_UNCOMPRESSED_BYTES = 30 * 1024 * 1024;

export type ExtractedCcdaDocument = {
  name: string;
  xml: string;
};

const isPdfBuffer = (buffer: Buffer): boolean =>
  buffer.length >= 4 && buffer.subarray(0, 4).toString('utf8') === '%PDF';

const isXmlBuffer = (buffer: Buffer): boolean => {
  const head = buffer.subarray(0, Math.min(buffer.length, 200)).toString('utf8').trimStart();
  return head.startsWith('<?xml') || head.startsWith('<ClinicalDocument') || head.startsWith('<');
};

const isZipBuffer = (buffer: Buffer): boolean =>
  buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b;

/**
 * Extracts C-CDA XML document strings from a zip package or a single XML buffer.
 */
export const unzipHealthSummary = (buffer: Buffer): ExtractedCcdaDocument[] => {
  console.log('🚀 unzipHealthSummary');

  if (isPdfBuffer(buffer)) {
    throw new Error(
      'PDF-only uploads are not supported yet. Upload the Health Summary zip (or DOC*.XML) instead.',
    );
  }

  if (isXmlBuffer(buffer) && !isZipBuffer(buffer)) {
    return [{ name: 'document.xml', xml: buffer.toString('utf8') }];
  }

  if (!isZipBuffer(buffer)) {
    throw new Error('Upload must be a zip Health Summary package or a C-CDA XML document');
  }

  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();
  if (entries.length > MAX_ZIP_ENTRIES) {
    throw new Error(`Zip has too many entries (max ${MAX_ZIP_ENTRIES})`);
  }

  let uncompressedTotal = 0;
  const docs: ExtractedCcdaDocument[] = [];

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const name = entry.entryName.replace(/\\/g, '/');
    if (name.includes('..')) {
      throw new Error('Zip entry path traversal is not allowed');
    }

    const size = entry.header.size;
    uncompressedTotal += size;
    if (uncompressedTotal > MAX_UNCOMPRESSED_BYTES) {
      throw new Error(`Zip uncompressed size exceeds ${MAX_UNCOMPRESSED_BYTES} bytes`);
    }

    const base = name.split('/').pop() ?? name;
    const underIhe = /(?:^|\/)IHE_XDM\//i.test(name);
    const isDocXml = /^DOC\d+\.XML$/i.test(base);
    if (!underIhe || !isDocXml) continue;

    const xml = entry.getData().toString('utf8');
    docs.push({ name: base, xml });
  }

  if (docs.length === 0) {
    const anyXml = entries.filter((entry) => {
      if (entry.isDirectory) return false;
      const name = entry.entryName.replace(/\\/g, '/');
      if (name.includes('..')) return false;
      return /\.xml$/i.test(name) && !/METADATA\.XML$/i.test(name);
    });
    for (const entry of anyXml) {
      docs.push({
        name: entry.entryName.split('/').pop() ?? entry.entryName,
        xml: entry.getData().toString('utf8'),
      });
    }
  }

  if (docs.length === 0) {
    throw new Error(
      'No C-CDA DOC*.XML found in package. PDF-only packages are not supported yet.',
    );
  }

  docs.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  console.log(`✅ unzipHealthSummary: ${docs.length} document(s)`);
  return docs;
};
