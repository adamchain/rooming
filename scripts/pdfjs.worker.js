import { copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as pdfjsLib from 'pdfjs-dist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Ensure public directory exists
  mkdirSync(join(__dirname, '..', 'public'), { recursive: true });

  // Get the path to the PDF.js worker file from the package
  const workerPath = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).pathname;
  
  // Copy the worker file to the public directory
  copyFileSync(workerPath, join(__dirname, '..', 'public', 'pdf.worker.js'));
  
  console.log('Successfully copied PDF.js worker file to public directory');
} catch (error) {
  console.error('Error copying PDF.js worker file:', error);
  process.exit(1);
}