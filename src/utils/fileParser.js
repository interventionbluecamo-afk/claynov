import mammoth from 'mammoth';

// Lazy load PDF.js to avoid initialization errors
let pdfjsModule = null;

async function getPdfJs() {
  if (!pdfjsModule) {
    try {
      // Import PDF.js dynamically
      pdfjsModule = await import('pdfjs-dist');
      
      // Set worker source before using
      if (pdfjsModule.default?.GlobalWorkerOptions) {
        pdfjsModule.default.GlobalWorkerOptions.workerSrc = 
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsModule.default.version || '3.11.174'}/pdf.worker.min.js`;
        return pdfjsModule.default;
      } else if (pdfjsModule.GlobalWorkerOptions) {
        pdfjsModule.GlobalWorkerOptions.workerSrc = 
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsModule.version || '3.11.174'}/pdf.worker.min.js`;
        return pdfjsModule;
      }
      
      // Fallback: try direct access
      const pdfjs = pdfjsModule.default || pdfjsModule;
      if (pdfjs && typeof pdfjs.getDocument === 'function') {
        return pdfjs;
      }
      
      throw new Error('PDF.js not properly loaded');
    } catch (error) {
      console.error('PDF.js initialization error:', error);
      throw new Error('Failed to load PDF processing library');
    }
  }
  return pdfjsModule.default || pdfjsModule;
}

export async function parseResume(file) {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // Initialize PDF.js only when needed
      const pdfjsLib = await getPdfJs();
      
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      let fullText = '';
      const numPages = pdf.numPages;
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return {
        text: fullText.trim(),
        pages: numPages,
        success: true
      };
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') || 
      fileName.endsWith('.docx')
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return {
        text: result.value,
        pages: Math.ceil(result.value.length / 2000), // Estimate
        success: true
      };
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOC/DOCX.');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    return {
      text: null,
      pages: 0,
      success: false,
      error: error.message || 'Failed to parse file'
    };
  }
}
