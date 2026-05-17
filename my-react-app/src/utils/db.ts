import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface PixelArtProject {
  id: string;
  name: string;
  canvasData: string[][];
  canvasSize: number;
  colors: string[];
  createdAt: Date;
  lastModified: Date;
  thumbnail: string;
}

interface PixelArtDB extends DBSchema {
  projects: {
    key: string;
    value: PixelArtProject;
    indexes: { 'by-date': Date };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: unknown;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PixelArtDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<PixelArtDB>('pixel-art-studio', 1, {
      upgrade(db) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-date', 'lastModified');
        db.createObjectStore('settings', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
};

export const saveProject = async (
  name: string,
  canvasData: string[][],
  canvasSize: number,
  colors: string[],
  thumbnail: string,
  existingId?: string
): Promise<string> => {
  const db = await getDB();
  const id = existingId || crypto.randomUUID();
  const now = new Date();

  const project: PixelArtProject = {
    id,
    name,
    canvasData,
    canvasSize,
    colors,
    createdAt: existingId ? (await db.get('projects', id))?.createdAt || now : now,
    lastModified: now,
    thumbnail,
  };

  await db.put('projects', project);
  return id;
};

export const loadProject = async (id: string): Promise<PixelArtProject | undefined> => {
  const db = await getDB();
  return db.get('projects', id);
};

export const deleteProject = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('projects', id);
};

export const getAllProjects = async (): Promise<PixelArtProject[]> => {
  const db = await getDB();
  return db.getAllFromIndex('projects', 'by-date');
};

export const saveSetting = async <T>(key: string, value: T): Promise<void> => {
  const db = await getDB();
  await db.put('settings', { key, value });
};

export const loadSetting = async <T>(key: string): Promise<T | undefined> => {
  const db = await getDB();
  const result = await db.get('settings', key);
  return result?.value as T | undefined;
};

export const generateThumbnail = (canvasData: string[][], size: number): string => {
  const cellSize = 4;
  const canvas = document.createElement('canvas');
  canvas.width = size * cellSize;
  canvas.height = size * cellSize;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (canvasData[row][col]) {
        ctx.fillStyle = canvasData[row][col];
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  return canvas.toDataURL('image/png');
};
