'use server';

import * as z from 'zod';
import { formSchema } from './schemas';

export async function handleFormSubmission(data: z.infer<typeof formSchema>) {
  console.log('Server received contact form submission:', data);
  // Here you would integrate with an email service like Resend, SendGrid, etc.
  return { success: true, message: 'Thanks for reaching out. I will get back to you shortly.' };
}
