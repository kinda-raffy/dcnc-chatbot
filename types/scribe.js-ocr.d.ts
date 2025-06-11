declare module 'scribe.js-ocr' {
  interface Scribe {
    extractText(files: string[] | File[]): Promise<string>;
  }

  const scribe: Scribe;
  export default scribe;
}
