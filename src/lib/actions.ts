'use server';

import * as z from 'zod';
import { formSchema } from './schemas';
import { buildContactNotificationHtml, buildReplyEmailHtml } from './email-templates';

import { db } from '../db';
import { contacts } from '../db/schema';
import { and, count, eq, gt } from 'drizzle-orm';
import { clientIp, rateLimit } from './rate-limit';
import { isAdmin } from './auth-server';

async function sendBrevoEmail(payload: object, apiKey: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });
  return res;
}

function handleBrevoError(errorText: string) {
  try {
    const errorJson = JSON.parse(errorText);
    if (errorJson.code === 'unauthorized' || errorText.includes('unrecognised IP address')) {
      return 'Brevo Error: Unrecognized IP address. Please whitelist your IP in your Brevo Security Settings (https://app.brevo.com/security/authorised_ips).';
    }
    return `Failed to send email: ${errorJson.message || 'Unknown Server Error'}`;
  } catch {
    return 'Failed to send email via server.';
  }
}

export async function handleFormSubmission(input: z.infer<typeof formSchema>) {
  // Client-side validation can be bypassed, so validate again on the server
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: 'Please check the form fields and try again.' };
  }
  const data = parsed.data;

  // Bots fill the hidden honeypot field; pretend it worked so they don't adapt
  if (data.website) {
    return { success: true, message: 'Thanks for reaching out. I will get back to you shortly.' };
  }

  // At most 5 messages per IP per 10 minutes, and 3 per email address per hour
  const ip = await clientIp();
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000).ok) {
    return { success: false, message: 'Too many messages in a short time. Please try again later.' };
  }

  try {
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(contacts)
      .where(and(eq(contacts.email, data.email), gt(contacts.createdAt, new Date(Date.now() - 60 * 60 * 1000))));
    if (recent >= 3) {
      return { success: false, message: 'You have already sent a few messages recently. I will reply soon.' };
    }

    // 1. Save to Database
    await db.insert(contacts).values({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    // 2. Send branded notification email to admin via Brevo
    const brevoApiKey = process.env.BREVO_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@utkristi.com';

    if (brevoApiKey) {
      const emailPayload = {
        sender: { name: 'Utkristi Portfolio', email: adminEmail },
        to: [{ email: adminEmail, name: 'Admin' }],
        replyTo: { email: data.email, name: data.name },
        subject: `New Contact: ${data.name}`,
        htmlContent: buildContactNotificationHtml({
          senderName: data.name,
          senderEmail: data.email,
          message: data.message,
        }),
      };

      const res = await sendBrevoEmail(emailPayload, brevoApiKey);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Brevo API Error:', errorText);
        console.warn(handleBrevoError(errorText));
      }
    } else {
      console.warn('BREVO_API_KEY not found. Email was not sent, but message is saved to DB.');
    }

    return { success: true, message: 'Thanks for reaching out. I will get back to you shortly.' };
  } catch (error) {
    console.error('Error handling form submission:', error);
    return { success: false, message: 'Failed to submit form.' };
  }
}

const CONTACT_STATUSES = ['read', 'unread', 'resolved'] as const;

export async function updateContactStatus(id: number, status: 'read' | 'unread' | 'resolved') {
  if (!(await isAdmin())) return { success: false };
  if (!Number.isInteger(id) || !CONTACT_STATUSES.includes(status)) return { success: false };
  try {
    await db.update(contacts).set({ status }).where(eq(contacts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to update contact status:', error);
    return { success: false };
  }
}

export async function deleteContact(id: number) {
  if (!(await isAdmin())) return { success: false };
  if (!Number.isInteger(id)) return { success: false };
  try {
    await db.delete(contacts).where(eq(contacts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete contact:', error);
    return { success: false };
  }
}

export async function sendReply(id: number, message: string) {
  if (!(await isAdmin())) return { success: false, message: 'Your session expired. Please log in again.' };
  if (!Number.isInteger(id) || !message.trim() || message.length > 10000) {
    return { success: false, message: 'Reply must be between 1 and 10,000 characters.' };
  }

  try {
    // Recipient comes from the stored ticket, never from the client
    const [ticket] = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    if (!ticket) return { success: false, message: 'Ticket not found.' };
    const toEmail = ticket.email;
    const originalName = ticket.name;

    const brevoApiKey = process.env.BREVO_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@utkristi.com';

    if (!brevoApiKey) {
      return { success: false, message: 'Email API key not configured.' };
    }

    const emailPayload = {
      sender: { name: 'Utkarsh Gupta', email: adminEmail },
      to: [{ email: toEmail, name: originalName }],
      subject: `Re: Your Message to Utkristi`,
      htmlContent: buildReplyEmailHtml({
        recipientName: originalName,
        message,
      }),
    };

    const res = await sendBrevoEmail(emailPayload, brevoApiKey);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Brevo API Error:', errorText);
      return { success: false, message: handleBrevoError(errorText) };
    }

    // Save reply to database
    await db.update(contacts).set({ adminReply: message, status: 'resolved' }).where(eq(contacts.id, id));

    return { success: true, message: 'Reply sent successfully.' };
  } catch (error) {
    console.error('Failed to send reply:', error);
    return { success: false, message: 'Server connection error.' };
  }
}
