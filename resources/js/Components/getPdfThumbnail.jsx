import { useState } from 'react';

const getPdfThumbnail = ({ pdfFile }) => {
  const [thumbnail, setThumbnail] = useState(null);

  const generateThumbnail = (pdfFile) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const pdfData = e.target.result;
      const pdfjsLib = window['pdfjsLib'];

      if (!pdfjsLib) {
        console.error('PDF.js is not loaded!');
        return;
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      loadingTask.promise
        .then((pdf) => {
          pdf.getPage(1).then((page) => {
            const scale = 0.2;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise.then(() => {
              const dataUrl = canvas.toDataURL();
              setThumbnail(dataUrl);
            });
          });
        })
        .catch((error) => {
          console.error('Error generating thumbnail: ', error);
        });
    };

    fileReader.readAsArrayBuffer(pdfFile);
  };

  return (
    <div>
      {thumbnail ? (
        <img src={thumbnail} alt="PDF Thumbnail" className="rounded w-40 h-48" />
      ) : (
        <div>Loading thumbnail...</div>
      )}
    </div>
  );
};

export default getPdfThumbnail;
