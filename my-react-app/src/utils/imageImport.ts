export const imageToPixelTemplate = (
  imageSrc: string,
  targetSize: number = 16
): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;

      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;

      const template: string[][] = Array(targetSize)
        .fill(null)
        .map(() => Array(targetSize).fill(''));

      const cellSize = size / targetSize;

      for (let row = 0; row < targetSize; row++) {
        for (let col = 0; col < targetSize; col++) {
          const startX = Math.floor(col * cellSize);
          const startY = Math.floor(row * cellSize);
          const endX = Math.floor((col + 1) * cellSize);
          const endY = Math.floor((row + 1) * cellSize);

          let r = 0,
            g = 0,
            b = 0,
            count = 0;

          for (let y = startY; y < endY && y < size; y++) {
            for (let x = startX; x < endX && x < size; x++) {
              const idx = (y * size + x) * 4;
              r += pixels[idx];
              g += pixels[idx + 1];
              b += pixels[idx + 2];
              count++;
            }
          }

          if (count > 0) {
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            if (r > 240 && g > 240 && b > 240) {
              template[row][col] = '';
            } else {
              template[row][col] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }
          }
        }
      }

      resolve(template);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageSrc;
  });
};

export const importImageFromFile = (): Promise<string[][] | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        try {
          const template = await imageToPixelTemplate(dataUrl);
          resolve(template);
        } catch {
          alert('图片处理失败，请重试');
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    };

    input.click();
  });
};
