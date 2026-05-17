import { create } from 'zustand';

export type Tool = 'brush' | 'eraser' | 'fill';
export type CanvasSize = 16 | 32;

interface PixelArtState {
  canvasSize: CanvasSize;
  grid: string[][];
  currentColor: string;
  currentTool: Tool;
  history: string[][][];
  historyIndex: number;
  savedStatus: 'saved' | 'unsaved';
  template: string[][] | null;
  templateOpacity: number;

  setCanvasSize: (size: CanvasSize) => void;
  setCell: (row: number, col: number, color: string) => void;
  setCurrentColor: (color: string) => void;
  setCurrentTool: (tool: Tool) => void;
  fillCell: (row: number, col: number) => void;
  clearCanvas: () => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  setTemplate: (template: string[][] | null) => void;
  setTemplateOpacity: (opacity: number) => void;
  markSaved: () => void;
  resetCanvas: () => void;
}

const createEmptyGrid = (size: number): string[][] =>
  Array(size).fill(null).map(() => Array(size).fill(''));

export const usePixelArtStore = create<PixelArtState>((set, get) => ({
  canvasSize: 16,
  grid: createEmptyGrid(16),
  currentColor: '#FF6B9D',
  currentTool: 'brush',
  history: [],
  historyIndex: -1,
  savedStatus: 'saved',
  template: null,
  templateOpacity: 0.3,

  setCanvasSize: (size) => {
    set({
      canvasSize: size,
      grid: createEmptyGrid(size),
      history: [],
      historyIndex: -1,
      savedStatus: 'unsaved',
      template: null,
    });
  },

  setCell: (row, col, color) => {
    const { grid, canvasSize } = get();
    if (row < 0 || row >= canvasSize || col < 0 || col >= canvasSize) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = color;
    set({ grid: newGrid, savedStatus: 'unsaved' });
  },

  setCurrentColor: (color) => set({ currentColor: color }),

  setCurrentTool: (tool) => set({ currentTool: tool }),

  fillCell: (row, col) => {
    const { grid, canvasSize, currentColor } = get();
    if (row < 0 || row >= canvasSize || col < 0 || col >= canvasSize) return;
    if (grid[row][col] === currentColor) return;

    const newGrid = grid.map(r => [...r]);
    const targetColor = newGrid[row][col];
    const fill = (r: number, c: number) => {
      if (r < 0 || r >= canvasSize || c < 0 || c >= canvasSize) return;
      if (newGrid[r][c] !== targetColor) return;
      newGrid[r][c] = currentColor;
      fill(r + 1, c);
      fill(r - 1, c);
      fill(r, c + 1);
      fill(r, c - 1);
    };
    fill(row, col);
    set({ grid: newGrid, savedStatus: 'unsaved' });
  },

  clearCanvas: () => {
    const { canvasSize } = get();
    set({
      grid: createEmptyGrid(canvasSize),
      savedStatus: 'unsaved',
      template: null,
    });
  },

  saveToHistory: () => {
    const { grid, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(grid.map(r => [...r]));
    if (newHistory.length > 50) newHistory.shift();
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        grid: history[historyIndex - 1].map(r => [...r]),
        historyIndex: historyIndex - 1,
        savedStatus: 'unsaved',
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        grid: history[historyIndex + 1].map(r => [...r]),
        historyIndex: historyIndex + 1,
        savedStatus: 'unsaved',
      });
    }
  },

  setTemplate: (template) => {
    set({ template, savedStatus: 'unsaved' });
  },

  setTemplateOpacity: (opacity) => set({ templateOpacity: opacity }),

  markSaved: () => set({ savedStatus: 'saved' }),

  resetCanvas: () => {
    const { canvasSize } = get();
    set({
      grid: createEmptyGrid(canvasSize),
      history: [],
      historyIndex: -1,
      savedStatus: 'saved',
      template: null,
    });
  },
}));
