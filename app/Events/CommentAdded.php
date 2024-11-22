<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Viewer</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    canvas { display: block; margin: 0 auto; }
  </style>
</head>
<body>
  <div id="pdf-container">
    <canvas id="pdf-canvas"></canvas>
  </div>

  <script>
    // Get the URL of the PDF passed via the query string
    const urlParams = new URLSearchParams(window.location.search);
    const pdfUrl = urlParams.get('pdfUrl') || 'http://127.0.0.1:8000/sample.pdf';

    // Set up PDF.js
    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise.then(pdf => {
      const totalPages = pdf.numPages;
      window.parent.postMessage({ totalPages: totalPages }, '*');  // Send total pages to parent

      let currentPage = 1;

      // Render the first page
      renderPage(pdf, currentPage);

      function renderPage(pdf, pageNum) {
        pdf.getPage(pageNum).then(page => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.getElementById('pdf-canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          page.render(renderContext).promise.then(() => {
            // Send the current page number back to the parent window using postMessage
            window.parent.postMessage({ pageNumber: pageNum }, '*');
          });
        });
      }

      // Handle page navigation
      document.getElementById('nextPageBtn').addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage(pdf, currentPage);
        }
      });

      document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(pdf, currentPage);
        }
      });
    });
  </script>
</body>
</html>
