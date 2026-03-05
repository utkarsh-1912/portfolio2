'use server';

import * as z from 'zod';
import { formSchema } from './schemas';
import { buildContactNotificationHtml, buildReplyEmailHtml } from './email-templates';

import { db } from '../db';
import { contacts } from '../db/schema';

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

export async function handleFormSubmission(data: z.infer<typeof formSchema>) {
  try {
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

export async function updateContactStatus(id: number, status: 'read' | 'unread' | 'resolved') {
  try {
    const { eq } = await import('drizzle-orm');
    await db.update(contacts).set({ status }).where(eq(contacts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to update contact status:', error);
    return { success: false };
  }
}

export async function deleteContact(id: number) {
  try {
    const { eq } = await import('drizzle-orm');
    await db.delete(contacts).where(eq(contacts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete contact:', error);
    return { success: false };
  }
}

export async function sendReply(id: number, toEmail: string, originalName: string, message: string) {
  try {
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
    const { eq } = await import('drizzle-orm');
    await db.update(contacts).set({ adminReply: message, status: 'resolved' }).where(eq(contacts.id, id));

    return { success: true, message: 'Reply sent successfully.' };
  } catch (error) {
    console.error('Failed to send reply:', error);
    return { success: false, message: 'Server connection error.' };
  }
}
