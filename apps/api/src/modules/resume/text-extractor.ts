import pdfParse from 'pdf-parse';

export const extractTextFromPdf = async (fileBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to parse PDF document.');
  }
};
