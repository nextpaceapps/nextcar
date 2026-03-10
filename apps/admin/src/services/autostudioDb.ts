import Dexie, { type Table } from 'dexie';

export interface ProcessedImage {
  id: string;
  original: string;
  final: string;
  timestamp: number;
}

export interface AppSettings {
  id: 'current';
  backgroundImage: string | null;
  backgroundImageMimeType: string | null;
}

export interface Gallery {
  id: string;
  name: string;
  createdAt: number;
}

export interface GalleryItem {
  id: string;
  galleryId: string;
  historyId: string;
  addedAt: number;
}

export class AutoStudioDB extends Dexie {
  history!: Table<ProcessedImage>;
  settings!: Table<AppSettings>;
  galleries!: Table<Gallery>;
  galleryItems!: Table<GalleryItem>;

  constructor() {
    super('AdminAutoStudioDB');
    this.version(2).stores({
      history: 'id, timestamp',
      settings: 'id'
    });
    this.version(3).stores({
      history: 'id, timestamp',
      settings: 'id',
      galleries: 'id, createdAt',
      galleryItems: 'id, galleryId, historyId, addedAt'
    });
  }
}

export const db = new AutoStudioDB();
