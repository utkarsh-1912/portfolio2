import * as z from 'zod';

export const formSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters.' }).max(100, { message: 'Name is too long.' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }).max(254),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters.' }).max(5000, { message: 'Message must be under 5,000 characters.' }),
});
