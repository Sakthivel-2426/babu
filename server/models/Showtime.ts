import mongoose, { Document, Schema } from 'mongoose';

export interface IShowtime extends Document {
  id: string;
  movieId: string;
  screenName: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  format: '2D' | '3D' | '4K Dolby Atmos' | 'IMAX Laser';
  date: string; // YYYY-MM-DD
  occupiedSeatIds: string[];
  createdAt: Date;
}

const ShowtimeSchema = new Schema<IShowtime>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    movieId: {
      type: String,
      required: true,
      index: true,
    },
    screenName: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
      required: true,
    },
    format: {
      type: String,
      enum: ['2D', '3D', '4K Dolby Atmos', 'IMAX Laser'],
      default: '4K Dolby Atmos',
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    occupiedSeatIds: {
      type: [String],
      default: [],
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

export const Showtime = mongoose.model<IShowtime>('Showtime', ShowtimeSchema);
