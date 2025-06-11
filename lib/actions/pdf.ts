'use server';

import scribe from 'scribe.js-ocr';

export async function extractPdfText(
  formData: FormData,
): Promise<{ text: string } | { error: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { error: 'No file provided.' };
    }

    if (file.type !== 'application/pdf') {
      return { error: 'Only PDF files are accepted.' };
    }

    const text = await scribe.extractText([file]);
    return { text };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred.';
    const stackTrace =
      error instanceof Error ? error.stack : 'No stack trace available.';
    console.error('Error extracting PDF:', {
      message: errorMessage,
      stack: stackTrace,
    });
    return { error: 'Failed to process PDF.' };
  }
}
