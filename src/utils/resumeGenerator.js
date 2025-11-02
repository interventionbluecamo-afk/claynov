import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * Generate a downloadable DOCX file from optimized resume text
 */
export async function generateResumeDocx(optimizedText) {
  // Parse markdown-like text into Word document structure
  const lines = optimizedText.split('\n').filter(line => line.trim());
  const children = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      children.push(new Paragraph({ text: '' }));
      continue;
    }

    // Check for headings (markdown style)
    if (trimmed.startsWith('# ')) {
      children.push(new Paragraph({
        text: trimmed.substring(2),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }));
    } else if (trimmed.startsWith('## ')) {
      children.push(new Paragraph({
        text: trimmed.substring(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 150 }
      }));
    } else if (trimmed.startsWith('### ')) {
      children.push(new Paragraph({
        text: trimmed.substring(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 100 }
      }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet points
      children.push(new Paragraph({
        text: trimmed.substring(2),
        bullet: { level: 0 },
        spacing: { after: 100 }
      }));
    } else {
      // Regular paragraph
      children.push(new Paragraph({
        text: trimmed,
        spacing: { after: 120 }
      }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children.length > 0 ? children : [
        new Paragraph({
          text: optimizedText || 'Optimized Resume',
          alignment: AlignmentType.LEFT
        })
      ]
    }]
  });

  return await Packer.toBlob(doc);
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

