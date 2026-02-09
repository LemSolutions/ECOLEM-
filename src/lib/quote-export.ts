/**
 * Esporta il preventivo come PDF
 */
export async function exportQuoteAsPDF(quoteElementId: string, filename: string = 'preventivo.pdf') {
  if (typeof window === 'undefined') {
    throw new Error('Questa funzione può essere eseguita solo lato client');
  }

  const element = document.getElementById(quoteElementId);
  if (!element) {
    throw new Error('Elemento preventivo non trovato');
  }

  try {
    // Import dinamico per evitare problemi con SSR
    const [{ default: jsPDF }, html2canvas] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    // Crea un canvas dall'elemento HTML
    const canvas = await html2canvas.default(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calcola le dimensioni per il PDF (A4)
    const pdfWidth = 210; // mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Crea il PDF
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Errore durante l\'export PDF:', error);
    throw error;
  }
}

/**
 * Esporta il preventivo come immagine PNG
 */
export async function exportQuoteAsImage(
  quoteElementId: string, 
  filename: string = 'preventivo.png'
) {
  if (typeof window === 'undefined') {
    throw new Error('Questa funzione può essere eseguita solo lato client');
  }

  const element = document.getElementById(quoteElementId);
  if (!element) {
    throw new Error('Elemento preventivo non trovato');
  }

  try {
    // Import dinamico per evitare problemi con SSR
    const html2canvas = await import('html2canvas');
    
    const canvas = await html2canvas.default(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Converti canvas in blob e scarica
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Errore nella creazione del blob');
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
    
    return true;
  } catch (error) {
    console.error('Errore durante l\'export immagine:', error);
    throw error;
  }
}

/**
 * Genera il nome file per il preventivo
 */
export function generateQuoteFilename(quoteNumber?: string, extension: string = 'pdf'): string {
  const prefix = quoteNumber || 'preventivo';
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.${extension}`;
}
