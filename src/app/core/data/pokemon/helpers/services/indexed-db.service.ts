import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PokemonDB extends DBSchema {
  pokemonList: {
    key: string;
    value: any;
  };
}

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<PokemonDB>>;

  constructor() {
    this.dbPromise = openDB<PokemonDB>('PokemonDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pokemonList')) {
          db.createObjectStore('pokemonList');
        }
      }
    });
  }

  async set(key: string, value: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put("pokemonList", value, key);
  }

  async get<T>(key: string): Promise<T | undefined> {
    const db = await this.dbPromise;
    return await db.get("pokemonList", key);
  }
}
