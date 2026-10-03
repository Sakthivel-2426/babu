import mongoose, { Document, Schema } from 'mongoose';

export interface ICastMember {
  name: string;
  role: string;
}

export interface IMovie extends Document {
  id: string; // custom id like 'movie-retro'
  title: string;
  tagline?: string;
  description: string;
  genre: string[];
  language: string;
  duration: string;
  rating: string;
  certificate?: string;
  imdbScore?: number;
  releaseYear?: number;
  category?: 'now-showing' | 'upcoming' | 'popular' | 'latest';
  releaseDate: string;
  director: string;
  cast: ICastMember[];
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  status: 'now-showing' | 'coming-soon' | 'ended';
  customShowtimes?: string[];
  availableFormats: string[];
  screens: string[];
  createdAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: 'Tamil',
    },
    duration: {
      type: String,
      default: '2h 30m',
    },
    rating: {
      type: String,
      default: 'U/A 16+',
    },
    certificate: {
      type: String,
    },
    imdbScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    releaseYear: {
      type: Number,
    },
    category: {
      type: String,
      enum: ['now-showing', 'upcoming', 'popular', 'latest'],
    },
    releaseDate: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: [true, 'Director name is required'],
    },
    cast: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
      },
    ],
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required'],
    },
    backdropUrl: {
      type: String,
    },
    trailerUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['now-showing', 'coming-soon', 'ended'],
      default: 'now-showing',
      index: true,
    },
    customShowtimes: {
      type: [String],
      default: [],
    },
    availableFormats: {
      type: [String],
      default: ['2D', '4K Dolby Atmos'],
    },
    screens: {
      type: [String],
      default: ['Screen 1 - 4K Dolby Atmos'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
