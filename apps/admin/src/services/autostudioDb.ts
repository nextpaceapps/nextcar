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

export class AutoStudioDB extends Dexie {
  history!: Table<ProcessedImage>;
  settings!: Table<AppSettings>;

  constructor() {
    super('AdminAutoStudioDB');
    this.version(2).stores({
      history: 'id, timestamp',
      settings: 'id'
    });
  }
}

export const db = new AutoStudioDB();
