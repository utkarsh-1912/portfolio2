'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { Mail, Phone } from 'lucide-react';
import { handleFormSubmission } from '@/lib/actions';
import { formSchema } from '@/lib/schemas';

export function ContactSection() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await handleFormSubmission(values);
      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <section id="contact" className="w-full py-24 sm:py-32 bg-muted/40">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-headline tracking-tighter text-center sm:text-4xl mb-4">Get In Touch</h2>
        <p className="text-center text-muted-foreground mb-12">
          Have a project in mind or just want to say hi? Feel free to reach out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">You can also contact me directly through these channels.</p>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a
                    href="mailto:utkarsh.19.12.01@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    utkarsh.19.12.01@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <a href="tel:+916394948921" className="text-muted-foreground hover:text-primary transition-colors">
                    (+91) 639-494-8921
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your message..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
