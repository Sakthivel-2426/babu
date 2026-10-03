import mongoose, { Document, Schema } from 'mongoose';

export interface IPricing extends Document {
  id: string;
  VIP: number;
  Premium: number;
  Regular: number;
  convenienceFeePerTicket: number;
  updatedAt: Date;
}

const PricingSchema = new Schema<IPricing>(
  {
    id: {
      type: String,
      default: 'default',
      unique: true,
    },
    VIP: {
      type: Number,
      default: 250,
      min: 0,
    },
    Premium: {
      type: Number,
      default: 200,
      min: 0,
    },
    Regular: {
      type: Number,
      default: 150,
      min: 0,
    },
    convenienceFeePerTicket: {
      type: Number,
      default: 30,
      min: 0,
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

export const Pricing = mongoose.model<IPricing>('Pricing', PricingSchema);
