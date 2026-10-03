import { Movie } from '../types';
import { TAMIL_MOVIES } from './tamilMovies';

/**
 * ============================================================================
 * BABU CINEMAS - DAILY MOVIE UPDATE & MANAGEMENT REGISTRY
 * Theatre Location: Uthiramerur, Kanchipuram, Tamil Nadu
 *
 * HOW TO ADD A NEW MOVIE EVERY DAY (Takes ~30 seconds):
 * ----------------------------------------------------------------------------
 * 1. Copy the DAILY_TEMPLATE block below.
 * 2. Paste it at the top of the `DAILY_NEW_MOVIES` array.
 * 3. Update the fields:
 *    - title: Movie Title (Tamil or English)
 *    - posterUrl: High quality movie poster image link
 *    - language: 'Tamil' | 'English' | 'Tamil & English'
 *    - genre: ['Action', 'Thriller', ...]
 *    - duration: e.g. "2h 45m"
 *    - releaseDate: "YYYY-MM-DD" (Used to automatically sort latest releases first)
 *    - certificate: "U" | "U/A 13+" | "U/A 16+" | "A"
 *    - description: Brief plot / synopsis
 *    - trailerUrl: YouTube embed or watch link
 *    - customShowtimes: ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM']
 *    - status: 'now-showing' (Currently Showing) | 'coming-soon' (Upcoming) | 'ended' (Ended)
 * 4. Save this file. The website automatically sorts newest movies first and
 *    displays them across the site without changing any UI code!
 * ============================================================================
 */

export const DAILY_TEMPLATE: Omit<Movie, 'id'> = {
  title: 'Sample Movie Name',
  tagline: 'Catchy theatrical tagline',
  description: 'An engaging synopsis describing the story and high-octane theatrical experience.',
  genre: ['Action', 'Drama'],
  language: 'Tamil', // 'Tamil' | 'English' | 'Tamil & English'
  duration: '2h 30m',
  rating: 'U/A 16+',
  certificate: 'U/A 16+',
  imdbScore: 8.5,
  releaseDate: '2026-10-05', // YYYY-MM-DD format
  releaseYear: 2026,
  director: 'Director Name',
  cast: [
    { name: 'Lead Actor', role: 'Main Protagonist' },
    { name: 'Lead Actress', role: 'Main Character' },
  ],
  posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
  trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  status: 'now-showing', // 'now-showing' | 'coming-soon' | 'ended'
  category: 'latest', // 'latest' | 'popular' | 'upcoming'
  customShowtimes: ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM'],
  availableFormats: ['2D', '4K Dolby Atmos'],
  screens: ['Screen 1 - 4K Dolby Atmos', 'Screen 2 - Barco 4K'],
};

/**
 * ============================================================================
 * DAILY NEW MOVIES LIST (LATEST UPDATES AT TOP)
 * You can add movies here directly every day!
 * ============================================================================
 */
export const DAILY_NEW_MOVIES: Movie[] = [
  {
    id: 'babu-movie-coolie-2025',
    title: 'Coolie',
    tagline: 'Superstar Rajinikanth in a high-octane Lokesh Kanagaraj universe spectacle.',
    description: 'Gold smuggling, past vendettas, and underground crime cartels converge in Chennai as Deva takes control of the illicit port mafia.',
    genre: ['Action', 'Crime', 'Thriller'],
    language: 'Tamil',
    duration: '2h 50m',
    rating: 'U/A 16+',
    certificate: 'U/A 16+',
    imdbScore: 9.1,
    releaseDate: '2025-08-15',
    releaseYear: 2025,
    director: 'Lokesh Kanagaraj',
    cast: [
      { name: 'Superstar Rajinikanth', role: 'Deva' },
      { name: 'Nagarjuna Akkineni', role: 'Simon' },
      { name: 'Soubin Shahir', role: 'Dayal' },
      { name: 'Shruti Haasan', role: 'Preethi' },
      { name: 'Upendra', role: 'Kaleesha' },
      { name: 'Sathyaraj', role: 'Rajasekar' },
    ],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Coolie_2025_poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    category: 'latest',
    customShowtimes: ['10:00 AM', '01:15 PM', '06:30 PM', '10:00 PM'],
    availableFormats: ['4K Dolby Atmos', 'IMAX Laser', '2D'],
    screens: ['Screen 1 - 4K Dolby Atmos'],
  },
  {
    id: 'babu-movie-goodbadugly',
    title: 'Good Bad Ugly',
    tagline: 'Ajith Kumar in an electric multi-shade action thriller.',
    description: 'AK brings fierce charisma and unpredictable style in Adhik Ravichandran high-speed action entertainer set across Spain and Chennai.',
    genre: ['Action', 'Thriller'],
    language: 'Tamil',
    duration: '2h 45m',
    rating: 'U/A 16+',
    certificate: 'U/A 16+',
    imdbScore: 8.9,
    releaseDate: '2025-05-01',
    releaseYear: 2025,
    director: 'Adhik Ravichandran',
    cast: [
      { name: 'Ajith Kumar', role: 'AK' },
      { name: 'Trisha Krishnan', role: 'Maya' },
      { name: 'Prasanna', role: 'ACP Vikram' },
      { name: 'Sunil', role: 'Babu' },
    ],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/Good_Bad_Ugly_poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    category: 'latest',
    customShowtimes: ['10:30 AM', '02:00 PM', '06:45 PM', '10:15 PM'],
    availableFormats: ['4K Dolby Atmos', '2D'],
    screens: ['Screen 2 - Barco 4K'],
  },
  {
    id: 'babu-movie-retro-2025',
    title: 'Retro',
    tagline: 'Suriya & Karthik Subbaraj unite for vintage gangster warfare.',
    description: 'An emotional and bloody gangster saga set in the flamboyant 1980s retro era with pulse-pounding action.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Tamil',
    duration: '2h 48m',
    rating: 'U/A 16+',
    certificate: 'U/A 16+',
    imdbScore: 8.8,
    releaseDate: '2025-04-14',
    releaseYear: 2025,
    director: 'Karthik Subbaraj',
    cast: [
      { name: 'Suriya', role: 'Paari' },
      { name: 'Pooja Hegde', role: 'Kavitha' },
      { name: 'Jayaram', role: 'Dharmaraj' },
      { name: 'Joju George', role: 'Kannan' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    category: 'latest',
    customShowtimes: ['11:00 AM', '02:30 PM', '07:00 PM', '10:30 PM'],
    availableFormats: ['4K Dolby Atmos', '2D'],
    screens: ['Screen 1 - 4K Dolby Atmos'],
  },
  {
    id: 'babu-movie-dragon-2025',
    title: 'Dragon',
    tagline: 'Pradeep Ranganathan returns with a zesty collegiate comedy-drama.',
    description: 'A witty, rebellious college youth navigates love, ego, and unexpected adult consequences in modern-day Chennai.',
    genre: ['Comedy', 'Drama', 'Romance'],
    language: 'Tamil',
    duration: '2h 34m',
    rating: 'U/A 13+',
    certificate: 'U/A 13+',
    imdbScore: 8.6,
    releaseDate: '2025-02-14',
    releaseYear: 2025,
    director: 'Ashwath Marimuthu',
    cast: [
      { name: 'Pradeep Ranganathan', role: 'Raghavan' },
      { name: 'Anupama Parameswaran', role: 'Keerthi' },
      { name: 'Kayadu Lohar', role: 'Pallavi' },
      { name: 'Mysskin', role: 'Professor' },
      { name: 'G.V. Prakash Kumar', role: 'Special Appearance' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    category: 'latest',
    customShowtimes: ['10:15 AM', '01:45 PM', '06:15 PM', '09:45 PM'],
    availableFormats: ['2D', '4K Dolby Atmos'],
    screens: ['Screen 3 - Gold VIP'],
  },
  {
    id: 'babu-movie-thuglife-2025',
    title: 'Thug Life',
    tagline: 'Kamal Haasan & Mani Ratnam collaborate after 37 legendary years.',
    description: 'A fierce underworld drama tracing the rise, exile, and roaring return of Rangaraya Sakthivel Nayakar.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Tamil',
    duration: '2h 55m',
    rating: 'U/A 16+',
    certificate: 'U/A 16+',
    imdbScore: 9.0,
    releaseDate: '2025-06-05',
    releaseYear: 2025,
    director: 'Mani Ratnam',
    cast: [
      { name: 'Kamal Haasan', role: 'Rangaraya Sakthivel Nayakar' },
      { name: 'Silambarasan TR', role: 'Amar' },
      { name: 'Trisha Krishnan', role: 'Janaki' },
      { name: 'Ashok Selvan', role: 'Inspector Karthik' },
      { name: 'Nasser', role: 'Periyavar' },
    ],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/Thug_Life_poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'coming-soon',
    category: 'upcoming',
    customShowtimes: ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM'],
    availableFormats: ['4K Dolby Atmos', 'IMAX Laser'],
    screens: ['Screen 1 - 4K Dolby Atmos'],
  },
  {
    id: 'babu-movie-avatar3-eng',
    title: 'Avatar: Fire and Ash',
    tagline: 'The battle for Pandora enters the realm of the Ash People.',
    description: 'Jake Sully and Neytiri journey to harsh volcanic lands where a volatile Na\'vi tribe challenges their fragile peace on Pandora.',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    duration: '3h 12m',
    rating: 'U/A 13+',
    certificate: 'U/A 13+',
    imdbScore: 8.9,
    releaseDate: '2025-12-19',
    releaseYear: 2025,
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully' },
      { name: 'Zoe Saldana', role: 'Neytiri' },
      { name: 'Sigourney Weaver', role: 'Kiri' },
      { name: 'Stephen Lang', role: 'Miles Quaritch' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'coming-soon',
    category: 'upcoming',
    customShowtimes: ['11:30 AM', '03:15 PM', '07:00 PM', '10:45 PM'],
    availableFormats: ['3D', '4K Dolby Atmos', 'IMAX Laser'],
    screens: ['Screen 1 - 4K Dolby Atmos'],
  }
];

/**
 * ============================================================================
 * HELPER FUNCTIONS FOR MOVIE MANAGEMENT
 * ============================================================================
 */

/**
 * Merges two movie lists, preventing duplicate IDs or identical titles.
 * Primary list entries take precedence.
 */
export function mergeMoviesWithoutDuplicates(primaryList: Movie[], fallbackList: Movie[]): Movie[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: Movie[] = [];

  const normalizeTitle = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  // 1. Add primary items
  for (const movie of primaryList) {
    const normTitle = normalizeTitle(movie.title);
    if (!seenIds.has(movie.id) && !seenTitles.has(normTitle)) {
      seenIds.add(movie.id);
      seenTitles.add(normTitle);
      result.push(movie);
    }
  }

  // 2. Add fallback items only if not already present
  for (const movie of fallbackList) {
    const normTitle = normalizeTitle(movie.title);
    if (!seenIds.has(movie.id) && !seenTitles.has(normTitle)) {
      seenIds.add(movie.id);
      seenTitles.add(normTitle);
      result.push(movie);
    }
  }

  return result;
}

/**
 * Sorts movies so that the latest release date / release year appears first.
 */
export function sortMoviesLatestFirst(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => {
    // 1. Compare ISO release dates if both exist
    if (a.releaseDate && b.releaseDate) {
      const timeA = new Date(a.releaseDate).getTime();
      const timeB = new Date(b.releaseDate).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeB - timeA; // Descending (newest first)
      }
    }
    // 2. Compare releaseYear if present
    const yearA = a.releaseYear || (a.releaseDate ? new Date(a.releaseDate).getFullYear() : 0);
    const yearB = b.releaseYear || (b.releaseDate ? new Date(b.releaseDate).getFullYear() : 0);
    if (yearA !== yearB) {
      return yearB - yearA;
    }
    // 3. Fallback to IMDb score or title
    return (b.imdbScore || 0) - (a.imdbScore || 0);
  });
}

/**
 * Returns all currently showing movies (status === 'now-showing').
 */
export function getCurrentlyShowingMovies(movies: Movie[]): Movie[] {
  return sortMoviesLatestFirst(movies.filter((m) => m.status === 'now-showing'));
}

/**
 * Returns newly released movies:
 * (Now showing movies released recently or marked as latest, sorted newest first).
 */
export function getNewlyReleasedMovies(movies: Movie[]): Movie[] {
  const nowShowing = movies.filter((m) => m.status === 'now-showing');
  const latestMarked = nowShowing.filter(
    (m) => m.category === 'latest' || (m.releaseYear && m.releaseYear >= 2024)
  );
  return sortMoviesLatestFirst(latestMarked.length > 0 ? latestMarked : nowShowing);
}

/**
 * Returns upcoming movies (status === 'coming-soon').
 */
export function getUpcomingMovies(movies: Movie[]): Movie[] {
  return sortMoviesLatestFirst(movies.filter((m) => m.status === 'coming-soon'));
}

/**
 * Returns ended / archived movies (status === 'ended').
 */
export function getEndedMovies(movies: Movie[]): Movie[] {
  return sortMoviesLatestFirst(movies.filter((m) => m.status === 'ended'));
}

/**
 * Returns the master unified movie collection for Babu Cinemas,
 * merging daily new additions and the historical archive without duplicates,
 * sorted latest releases first.
 */
export function getRegisteredMovies(): Movie[] {
  const merged = mergeMoviesWithoutDuplicates(DAILY_NEW_MOVIES, TAMIL_MOVIES);
  return sortMoviesLatestFirst(merged);
}
