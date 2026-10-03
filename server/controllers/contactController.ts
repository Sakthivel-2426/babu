import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

export async function submitContactMessage(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    const savedMessage = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      subject: subject || 'Ticket Inquiry',
      message: String(message).trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Our team will contact you shortly.',
      data: savedMessage,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getContactMessages(req: Request, res: Response) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
