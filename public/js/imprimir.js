let lastCanvas = null; // Variable global para guardar la imagen del mapa

function printMapWithReferences() {
  leafletImage(map, function(err, canvas) {
    if (err) {
      console.error("Error generando imagen del mapa:", err);
      alert("No se pudo generar la previsualización.");
      return;
    }

    lastCanvas = canvas;

    const previewImage = document.getElementById('previewImage');
    previewImage.src = canvas.toDataURL('image/png');

    document.getElementById('previewModal').style.display = 'block';
  });
}

function closePreview() {
  document.getElementById('previewModal').style.display = 'none';
}

function downloadPDF(format = 'portrait') {
  if (!lastCanvas) {
    alert('No hay imagen para generar PDF. Primero genera la previsualización.');
    return;
  }

  const { jsPDF } = window.jspdf;

  let pdf;
  let pdfWidth, pdfHeight;

  if (format === 'screen') {
    pdf = new jsPDF({
      orientation: lastCanvas.width > lastCanvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [lastCanvas.width, lastCanvas.height],
    });
    pdfWidth = lastCanvas.width;
    pdfHeight = lastCanvas.height;
  } else {
    const a4WidthMm = 210;
    const a4HeightMm = 297;
    const isPortrait = format === 'portrait';

    pdf = new jsPDF({
      orientation: format,
      unit: 'mm',
      format: 'a4',
    });

    pdfWidth = isPortrait ? a4WidthMm : a4HeightMm;
    pdfHeight = isPortrait ? a4HeightMm : a4WidthMm;
  }

  const imgData = lastCanvas.toDataURL('image/png');

  // Calcular renderización proporcional
  const imgRatio = lastCanvas.width / lastCanvas.height;
  const pdfRatio = pdfWidth / pdfHeight;

  let renderWidth, renderHeight;

  if (imgRatio > pdfRatio) {
    renderWidth = pdfWidth;
    renderHeight = pdfWidth / imgRatio;
  } else {
    renderHeight = pdfHeight;
    renderWidth = pdfHeight * imgRatio;
  }

  const xOffset = (pdfWidth - renderWidth) / 2;
  const yOffset = (pdfHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
  pdf.save('mapa_consulta.pdf');
  closePreview();
}
