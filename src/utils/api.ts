import type { VinylData } from '../App';

interface VinylRecord extends VinylData {
  id: string;
  imageUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'vinyl_records';

// Helper to get records from localStorage
function getStoredRecords(): VinylRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

// Helper to save records to localStorage
function saveRecords(records: VinylRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save data');
  }
}

export const api = {
  // Get all vinyl records
  async getRecords(): Promise<VinylRecord[]> {
    return getStoredRecords();
  },

  // Get a single record
  async getRecord(id: string): Promise<VinylRecord> {
    const records = getStoredRecords();
    const record = records.find(r => r.id === id);
    if (!record) {
      throw new Error('Record not found');
    }
    return record;
  },

  // Create a new record
  async createRecord(record: Partial<VinylData> & { imageUrl?: string }): Promise<VinylRecord> {
    const records = getStoredRecords();
    const now = Date.now();

    const newRecord: VinylRecord = {
      id: `record_${now}_${Math.random().toString(36).substr(2, 9)}`,
      artistName: record.artistName || '',
      albumName: record.albumName || '',
      serialNumber: record.serialNumber || '',
      matrixRunout: record.matrixRunout || '',
      imageUrl: record.imageUrl || null,
      // Optional Discogs fields
      year: record.year,
      country: record.country,
      genre: record.genre,
      style: record.style,
      label: record.label,
      format: record.format,
      discogsId: record.discogsId,
      discogsUrl: record.discogsUrl,
      createdAt: now,
      updatedAt: now,
    };

    records.push(newRecord);
    saveRecords(records);
    return newRecord;
  },

  // Update a record
  async updateRecord(id: string, updates: Partial<VinylData>): Promise<VinylRecord> {
    const records = getStoredRecords();
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Record not found');
    }

    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: Date.now(),
    };

    saveRecords(records);
    return records[index];
  },

  // Delete a record
  async deleteRecord(id: string): Promise<void> {
    const records = getStoredRecords();
    const filtered = records.filter(r => r.id !== id);
    saveRecords(filtered);
  },

  // Upload an image (store as base64 in the record)
  async uploadImage(image: string, recordId?: string): Promise<string> {
    // In a frontend-only version, we just return the base64 image
    return image;
  },
};
