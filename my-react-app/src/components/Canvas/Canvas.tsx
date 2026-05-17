import React, { useRef, useEffect, useCallback } from 'react';
import { usePixelArtStore } from '../../store/pixelArtStore';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    grid,
    canvasSize,
    currentColor,
    currentTool,
    template,
    templateOpacity,
    setCell,
    fillCell,
    saveToHistory,
  } = usePixelArtStore();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.min(
      Math.floor(500 / canvasSize),
      32
    );
    const canvasPixelSize = cellSize * canvasSize;

    canvas.width = canvasPixelSize;
    canvas.height = canvasPixelSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvasSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    for (let row = 0; row < canvasSize; row++) {
      for (let col = 0; col < canvasSize; col++) {
        const color = grid[row][col];
        if (color) {
          const x = col * cellSize;
          const y = row * cellSize;

          ctx.fillStyle = color;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          const gradient = ctx.createLinearGradient(x, y, x, y + cellSize);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
          ctx.fillStyle = gradient;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(x + 2, y + 2, cellSize - 6, 3);
        }
      }
    }

    if (template) {
      ctx.globalAlpha = templateOpacity;
      for (let row = 0; row < canvasSize; row++) {
        for (let col = 0; col < canvasSize; col++) {
          const color = template[row]?.[col];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(
              col * cellSize + 2,
              row * cellSize + 2,
              cellSize - 4,
              cellSize - 4
            );
          }
        }
      }
      ctx.globalAlpha = 1;
    }
  }, [grid, canvasSize, template, templateOpacity]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getCellFromEvent = (e: React.MouseEvent<HTMLCanvasElement>): { row: number; col: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / canvasSize;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < canvasSize && col >= 0 && col < canvasSize) {
      return { row, col };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellFromEvent(e);
    if (!cell) return;

    if (e.button === 0) {
      saveToHistory();
      if (currentTool === 'brush') {
        setCell(cell.row, cell.col, currentColor);
      } else if (currentTool === 'eraser') {
        setCell(cell.row, cell.col, '');
      } else if (currentTool === 'fill') {
        fillCell(cell.row, cell.col);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;

    if (currentTool === 'brush') {
      setCell(cell.row, cell.col, currentColor);
    } else if (currentTool === 'eraser') {
      setCell(cell.row, cell.col, '');
    }
  };

  return (
    <div style={styles.container}>
      <canvas
        ref={canvasRef}
        style={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  canvas: {
    cursor: 'crosshair',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
};

export default Canvas;
