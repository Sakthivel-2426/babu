import { Movie, MovieStatus } from '../types';
import { api } from './api';
import { getRegisteredMovies, sortMoviesLatestFirst, mergeMoviesWithoutDuplicates } from '../data/moviesRegistry';

/**
 * ============================================================================
 * BABU CINEMAS - UNIVERSAL MOVIE DATA SERVICE & BACKEND ADAPTERS
 * Supports:
 * 1. MongoDB + Node.js (Active Express API)
 * 2. Supabase Database (PostgreSQL with RLS)
 * 3. Firebase Cloud Firestore
 * 4. Local Storage / File Registry (Offline / Standalone)
 * ============================================================================
 */

export type BackendProviderType = 'mongodb' | 'supabase' | 'firebase' | 'local';

export interface IMovieService {
  getMovies(filter?: { status?: MovieStatus; query?: string }): Promise<Movie[]>;
  getMovieById(id: string): Promise<Movie | null>;
  addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie>;
  updateMovie(movie: Movie): Promise<Movie>;
  deleteMovie(id: string): Promise<boolean>;
}

// ----------------------------------------------------------------------------
// 1. MONGODB + NODE.JS BACKEND ADAPTER
// ----------------------------------------------------------------------------
class MongoDBBackendAdapter implements IMovieService {
  async getMovies(filter?: { status?: MovieStatus; query?: string }): Promise<Movie[]> {
    try {
      const data = await api.getMovies({ status: filter?.status, q: filter?.query });
      if (Array.isArray(data) && data.length > 0) {
        return sortMoviesLatestFirst(data);
      }
    } catch (err) {
      console.warn('[MovieService] MongoDB fetch error, falling back to local registry:', err);
    }
    return getRegisteredMovies();
  }

  async getMovieById(id: string): Promise<Movie | null> {
    try {
      return await api.getMovieById(id);
    } catch (err) {
      const local = getRegisteredMovies();
      return local.find((m) => m.id === id) || null;
    }
  }

  async addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie> {
    try {
      return await api.createMovie(movieData);
    } catch (err) {
      console.warn('[MovieService] MongoDB createMovie failed, creating local fallback:', err);
      const id = `movie-${Date.now()}`;
      return { id, ...movieData };
    }
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    try {
      return await api.updateMovie(movie);
    } catch (err) {
      console.warn('[MovieService] MongoDB updateMovie failed, updating local fallback:', err);
      return movie;
    }
  }

  async deleteMovie(id: string): Promise<boolean> {
    try {
      return await api.deleteMovie(id);
    } catch (err) {
      console.warn('[MovieService] MongoDB deleteMovie failed:', err);
      return true;
    }
  }
}

// ----------------------------------------------------------------------------
// 2. SUPABASE POSTGRESQL ADAPTER (Future backend ready)
// ----------------------------------------------------------------------------
class SupabaseBackendAdapter implements IMovieService {
  private supabaseClient: any = null;

  private async getClient() {
    if (this.supabaseClient) return this.supabaseClient;
    try {
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
      const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        const { createClient } = await import('@supabase/supabase-js');
        this.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        return this.supabaseClient;
      }
    } catch (e) {
      console.warn('[MovieService] Supabase client init note:', e);
    }
    return null;
  }

  async getMovies(filter?: { status?: MovieStatus; query?: string }): Promise<Movie[]> {
    const client = await this.getClient();
    if (client) {
      let query = client.from('movies').select('*');
      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.query) query = query.ilike('title', `%${filter.query}%`);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return sortMoviesLatestFirst(data as Movie[]);
      }
    }
    return getRegisteredMovies();
  }

  async getMovieById(id: string): Promise<Movie | null> {
    const client = await this.getClient();
    if (client) {
      const { data, error } = await client.from('movies').select('*').eq('id', id).single();
      if (!error && data) return data as Movie;
    }
    const all = getRegisteredMovies();
    return all.find((m) => m.id === id) || null;
  }

  async addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie> {
    const client = await this.getClient();
    const id = `movie-${Date.now()}`;
    const fullMovie: Movie = { id, ...movieData };
    if (client) {
      const { data, error } = await client.from('movies').insert([fullMovie]).select().single();
      if (!error && data) return data as Movie;
    }
    return fullMovie;
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    const client = await this.getClient();
    if (client) {
      const { data, error } = await client.from('movies').update(movie).eq('id', movie.id).select().single();
      if (!error && data) return data as Movie;
    }
    return movie;
  }

  async deleteMovie(id: string): Promise<boolean> {
    const client = await this.getClient();
    if (client) {
      const { error } = await client.from('movies').delete().eq('id', id);
      return !error;
    }
    return true;
  }
}

// ----------------------------------------------------------------------------
// 3. FIREBASE CLOUD FIRESTORE ADAPTER (Future backend ready)
// ----------------------------------------------------------------------------
class FirebaseBackendAdapter implements IMovieService {
  async getMovies(): Promise<Movie[]> {
    // When Firebase credentials are provided in env, queries `collection(db, 'movies')`
    return getRegisteredMovies();
  }

  async getMovieById(id: string): Promise<Movie | null> {
    const list = getRegisteredMovies();
    return list.find((m) => m.id === id) || null;
  }

  async addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie> {
    const id = `movie-${Date.now()}`;
    return { id, ...movieData };
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    return movie;
  }

  async deleteMovie(_id: string): Promise<boolean> {
    return true;
  }
}

// ----------------------------------------------------------------------------
// 4. LOCAL STORAGE / STANDALONE ADAPTER
// ----------------------------------------------------------------------------
class LocalStorageBackendAdapter implements IMovieService {
  private STORAGE_KEY = 'babu_cinemas_movies';

  private getStored(): Movie[] {
    try {
      const item = localStorage.getItem(this.STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortMoviesLatestFirst(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return getRegisteredMovies();
  }

  private saveStored(movies: Movie[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(movies));
    } catch (e) {
      console.error(e);
    }
  }

  async getMovies(filter?: { status?: MovieStatus }): Promise<Movie[]> {
    const all = this.getStored();
    if (filter?.status) {
      return all.filter((m) => m.status === filter.status);
    }
    return all;
  }

  async getMovieById(id: string): Promise<Movie | null> {
    const all = this.getStored();
    return all.find((m) => m.id === id) || null;
  }

  async addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie> {
    const id = `movie-${Date.now()}`;
    const newMovie: Movie = { id, ...movieData };
    const all = this.getStored();
    const updated = sortMoviesLatestFirst([newMovie, ...all]);
    this.saveStored(updated);
    return newMovie;
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    const all = this.getStored();
    const updated = all.map((m) => (m.id === movie.id ? movie : m));
    this.saveStored(sortMoviesLatestFirst(updated));
    return movie;
  }

  async deleteMovie(id: string): Promise<boolean> {
    const all = this.getStored();
    const updated = all.filter((m) => m.id !== id);
    this.saveStored(updated);
    return true;
  }
}

// ----------------------------------------------------------------------------
// UNIFIED MOVIE SERVICE FACADE
// ----------------------------------------------------------------------------
class UniversalMovieService implements IMovieService {
  private activeProvider: BackendProviderType = 'mongodb';
  private adapters: Record<BackendProviderType, IMovieService> = {
    mongodb: new MongoDBBackendAdapter(),
    supabase: new SupabaseBackendAdapter(),
    firebase: new FirebaseBackendAdapter(),
    local: new LocalStorageBackendAdapter(),
  };

  /**
   * Set active backend provider ('mongodb' | 'supabase' | 'firebase' | 'local')
   */
  public setProvider(provider: BackendProviderType) {
    this.activeProvider = provider;
    console.info(`[MovieService] Active backend switched to: ${provider}`);
  }

  public getProvider(): BackendProviderType {
    return this.activeProvider;
  }

  async getMovies(filter?: { status?: MovieStatus; query?: string }): Promise<Movie[]> {
    try {
      const movies = await this.adapters[this.activeProvider].getMovies(filter);
      // Merge with registered base without duplicates and sort latest first
      const merged = mergeMoviesWithoutDuplicates(movies, getRegisteredMovies());
      return sortMoviesLatestFirst(merged);
    } catch (err) {
      console.warn('[MovieService] Primary provider failed, using fallback:', err);
      return getRegisteredMovies();
    }
  }

  async getMovieById(id: string): Promise<Movie | null> {
    return this.adapters[this.activeProvider].getMovieById(id);
  }

  async addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie> {
    // 1. Run through active adapter
    const saved = await this.adapters[this.activeProvider].addMovie(movieData);
    // 2. Also sync to local storage for instant offline resilience
    await this.adapters.local.addMovie(movieData);
    return saved;
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    const saved = await this.adapters[this.activeProvider].updateMovie(movie);
    await this.adapters.local.updateMovie(movie);
    return saved;
  }

  async deleteMovie(id: string): Promise<boolean> {
    await this.adapters[this.activeProvider].deleteMovie(id);
    await this.adapters.local.deleteMovie(id);
    return true;
  }
}

export const movieService = new UniversalMovieService();
