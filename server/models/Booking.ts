import mongoose, { Document, Schema } from 'mongoose';

export interface IBookedSeat {
  id: string;
  tier: 'VIP' | 'Premium' | 'Regular';
  price: number;
}

export interface IBooking extends Document {
  id: string; // e.g. "BT20268492"
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieFormat: string;
  theatreName: string;
  screenName: string;
  date: string;
  showtime: string;
  seats: IBookedSeat[];
  ticketTotal: number;
  convenienceFee: number;
  discount: number;
  discountCode?: string;
  totalPaid: number;
  paymentMethod: string;
  paymentId?: string;
  orderId?: string;
  bookedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
    },
    userName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    userPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
      index: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
      default: '',
    },
    movieFormat: {
      type: String,
      default: '4K Dolby Atmos',
    },
    theatreName: {
      type: String,
      default: 'BABU CINEMAS',
    },
    screenName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    showtime: {
      type: String,
      required: true,
    },
    seats: [
      {
        id: { type: String, required: true },
        tier: { type: String, enum: ['VIP', 'Premium', 'Regular'], required: true },
        price: { type: Number, required: true },
      },
    ],
    ticketTotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountCode: {
      type: String,
    },
    totalPaid: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    bookedAt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
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

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
