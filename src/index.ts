import { getDocument } from 'pdfjs-dist';

const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';

async function fetchPDF(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function extractText(pdfBuffer: Uint8Array): Promise<string> {
  const loadingTask = getDocument({ data: pdfBuffer });
  const pdfDocument = await loadingTask.promise;

  let extractedText = '';

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const content = await page.getTextContent({ disableCombineTextItems: true, includeMarkedContent: false });
    const pageText = content.items.map((item) => ("str" in item ? item.str : ""));
    extractedText += pageText.join(' ') + '\n';
  }

  // console.log(extractedText);
  return extractedText;
}

(async () => {
  try {
    const pdfBuffer = await fetchPDF(url);
    const data = await extractText(pdfBuffer);
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
})();
