'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

/* -------------------------------------------------------------------------- */
/* Helper : génère un blob JPEG **ou** PNG suivant `mime`                     */
/* -------------------------------------------------------------------------- */
function getCroppedImg(imageSrc, pixelCrop, mime = 'image/png') {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas ctx error'));
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, 1024, 1024
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Empty canvas'));
          blob.name = `cropped.${mime === 'image/png' ? 'png' : 'jpg'}`;
          resolve(blob);
        },
        mime,
        0.95
      );
    };
    image.onerror = reject;
  });
}

export default function ImageCropper({ imageSrc, mimeType = 'image/jpeg', onCropComplete, onCancel, isUploading }) {
  const [crop, setCrop]   = useState({ x: 0, y: 0 });
  const [zoom, setZoom]   = useState(1);
  const [area, setArea]   = useState(null);

  const onCropPixelsComplete = useCallback((_, croppedPixels) => {
    setArea(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!area) return;
    try {
      const blob = await getCroppedImg(imageSrc, area, mimeType);
      onCropComplete(blob);
    } catch (e) {
      console.error(e);
      alert("Erreur lors du recadrage de l'image.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-4 flex flex-col">
        <h3 className="text-xl font-semibold mb-4">Recadrer l'image (carré)</h3>

        <div className="relative w-full h-80 sm:h-96 bg-checkerboard">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropPixelsComplete}
          />
        </div>

        <div className="flex items-center mt-4">
          <label className="text-sm mr-2">Zoom:</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm">Annuler</button>
          <button onClick={handleCrop} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold" disabled={isUploading}>
            {isUploading ? 'Envoi...' : 'Valider'}
          </button>
        </div>
      </div>
    </div>
  );
}
