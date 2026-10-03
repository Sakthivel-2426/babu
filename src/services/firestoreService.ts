import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../lib/firebase';
import { Booking, Movie, Offer } from '../types';

/**
 * ============================================================================
 * BABU CINEMAS - CLOUD FIRESTORE SERVICE
 * Handles Cloud Firestore operations for:
 * 1. Bookings collection
 * 2. Movies collection
 * 3. Offers / Coupons collection
 * 4. Customer Contacts / Enquiries
 * ============================================================================
 */

export const firestoreService = {
  isConfigured(): boolean {
    return isFirebaseConfigured;
  },

  // --------------------------------------------------------------------------
  // BOOKINGS
  // --------------------------------------------------------------------------
  async saveBooking(booking: Booking): Promise<boolean> {
    if (!isFirebaseConfigured) return false;
    try {
      const docRef = doc(firestore, 'bookings', booking.id);
      await setDoc(docRef, {
        ...booking,
        createdAt: new Date().toISOString(),
      });
      console.log(`[Firestore] Booking ${booking.id} synced to Cloud Firestore.`);
      return true;
    } catch (err) {
      console.warn('[Firestore] Error saving booking:', err);
      return false;
    }
  },

  async getBookings(): Promise<Booking[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const bookingsCol = collection(firestore, 'bookings');
      const snap = await getDocs(bookingsCol);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Booking);
      }
    } catch (err) {
      console.warn('[Firestore] Error getting bookings:', err);
    }
    return [];
  },

  async cancelBooking(bookingId: string): Promise<boolean> {
    if (!isFirebaseConfigured) return false;
    try {
      const docRef = doc(firestore, 'bookings', bookingId);
      await updateDoc(docRef, { status: 'CANCELLED' });
      return true;
    } catch (err) {
      console.warn('[Firestore] Error cancelling booking in Firestore:', err);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // OFFERS / PROMOTIONS
  // --------------------------------------------------------------------------
  async getOffers(): Promise<Offer[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const offersCol = collection(firestore, 'offers');
      const snap = await getDocs(offersCol);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Offer);
      }
    } catch (err) {
      console.warn('[Firestore] Error getting offers:', err);
    }
    return [];
  },

  async saveOffer(offer: Offer): Promise<boolean> {
    if (!isFirebaseConfigured) return false;
    try {
      const docRef = doc(firestore, 'offers', offer.id);
      await setDoc(docRef, offer);
      return true;
    } catch (err) {
      console.warn('[Firestore] Error saving offer:', err);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // CUSTOMER CONTACT & ENQUIRY MESSAGES
  // --------------------------------------------------------------------------
  async saveContactMessage(message: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    if (!isFirebaseConfigured) return false;
    try {
      const id = `msg-${Date.now()}`;
      const docRef = doc(firestore, 'contact_messages', id);
      await setDoc(docRef, {
        id,
        ...message,
        createdAt: new Date().toISOString(),
        theatre: 'Babu Cinemas - Uthiramerur',
      });
      console.log(`[Firestore] Contact message saved to Cloud Firestore (${id}).`);
      return true;
    } catch (err) {
      console.warn('[Firestore] Error saving contact message:', err);
      return false;
    }
  },
};
