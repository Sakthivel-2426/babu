import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minTickets?: number;
  validUntil: string;
  category: 'Student' | 'Weekend' | 'Food' | 'Family';
  icon: string;
  terms: string[];
  createdAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Offer description is required'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minTickets: {
      type: Number,
      default: 1,
    },
    validUntil: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Student', 'Weekend', 'Food', 'Family'],
      default: 'Weekend',
    },
    icon: {
      type: String,
      default: 'Tag',
    },
    terms: {
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

export const Offer = mongoose.model<IOffer>('Offer', OfferSchema);
