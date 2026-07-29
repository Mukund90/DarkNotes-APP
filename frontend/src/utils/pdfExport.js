import jsPDF from 'jspdf';
export function downloadNoteAsPDF(note) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  doc.setFontSize(18);
  doc.text(note.title || 'Untitled', margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(120);
  const dateStr = note.updated_at
    ? new Date(note.updated_at).toLocaleString()
    : '';
  doc.text(`Last updated: ${dateStr}`, margin, 28);

  doc.setDrawColor(200);
  doc.line(margin, 32, pageWidth - margin, 32);

  doc.setFontSize(12);
  doc.setTextColor(30);
  const contentLines = doc.splitTextToSize(note.content || '', maxWidth);
  doc.text(contentLines, margin, 42);

  const safeTitle = (note.title || 'note')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  doc.save(`${safeTitle}.pdf`);
}

// Download ALL notes combined into a single PDF file
export function downloadAllNotesAsPDF(notes) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  doc.setFontSize(20);
  doc.text('DarkNotes — All Notes', margin, y);
  y += 12;

  notes.forEach((note, index) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(20);
    doc.text(note.title || 'Untitled', margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setTextColor(130);
    const dateStr = note.updated_at
      ? new Date(note.updated_at).toLocaleString()
      : '';
    doc.text(dateStr, margin, y);
    y += 6;

    doc.setFontSize(11);
    doc.setTextColor(40);
    const lines = doc.splitTextToSize(note.content || '', maxWidth);

    lines.forEach((line) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    y += 8;
    if (index !== notes.length - 1) {
      doc.setDrawColor(220);
      doc.line(margin, y - 4, pageWidth - margin, y - 4);
    }
  });

  doc.save('all_notes.pdf');
}
