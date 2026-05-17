export const exportToPNG = (
  canvasData: string[][],
  size: number,
  filename: string = 'pixel-art'
): void => {
  const pixelSize = 20;
  const canvas = document.createElement('canvas');
  canvas.width = size * pixelSize;
  canvas.height = size * pixelSize;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const color = canvasData[row][col];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize * 0.3);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(col * pixelSize, row * pixelSize + pixelSize * 0.7, pixelSize, pixelSize * 0.3);
      }
    }
  }

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const generateShareLink = (
  canvasData: string[][],
): string => {
  const compressed = canvasData.map(row =>
    row.map(cell => cell || '0').join('')
  ).join('|');
  const encoded = btoa(compressed);
  const baseUrl = window.location.origin;
  return `${baseUrl}?art=${encoded}`;
};
