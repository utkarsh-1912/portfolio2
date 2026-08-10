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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, Terminal, Github, Linkedin, Youtube } from 'lucide-react';
import { XLogo } from '@/components/ui/x-logo';
import { handleFormSubmission } from '@/lib/actions';
import { formSchema } from '@/lib/schemas';
import Link from 'next/link';

export function ContactSection({ heroData }: { heroData?: any }) {
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
    <section id="contact" className="w-full min-h-screen py-10 md:py-16 lg:py-28 bg-muted/20 relative border-t border-border/50 snap-start flex flex-col justify-center overflow-y-auto">
      <div className="container relative z-10">
        <div className="text-center md:text-left mb-14 font-mono">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1 border border-primary/30 rounded-none">./contact</span>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">&gt; ping -c 4 user@contact</h2>
          <p className="mt-4 max-w-xl text-muted-foreground font-sans">
            Ready to start your next project? Let's connect and build something extraordinary.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Methods */}
          {/* Contact Methods */}
          <div className="space-y-6 font-mono">
            {/* Email Protocol */}
            <a
              href="mailto:utkarshofficial1912@gmail.com"
              className="block relative p-6 rounded-none border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-primary/10 border-l border-b border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-3">Protocol: SMTP</div>
              <div className="text-lg lg:text-xl text-foreground font-bold group-hover:text-primary transition-colors truncate">
                utkarshofficial1912@gmail.com
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-80">
                <div className="h-1.5 w-1.5 bg-green-500 animate-pulse"></div>
                Server Online — Awaiting connection
              </div>
            </a>

            {/* Phone Protocol */}
            <a
              href="tel:+916394948921"
              className="block relative p-6 rounded-none border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-primary/10 border-l border-b border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-3">Protocol: TEL</div>
              <div className="text-lg lg:text-xl text-foreground font-bold group-hover:text-primary transition-colors">
                (+91) 639-494-8921
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-80">
                <div className="h-1.5 w-1.5 bg-green-500 animate-pulse"></div>
                Secure Line — Active
              </div>
            </a>

            {/* Social Links - Individual Animated Boxes */}
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-4">Connected Nodes</div>
              <div className="flex flex-wrap gap-3">
              {heroData?.githubUrl && heroData.githubUrl !== '#' && (
                <Link href={heroData.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center p-1.5 rounded-none border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Github className="h-5 w-5" />
                  </div>
                  <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-in-out">
                    <div className="overflow-hidden flex items-center">
                      <span className="whitespace-nowrap text-xs font-bold text-foreground pl-3 pr-2">
                        {heroData.githubUrl.split('/').filter(Boolean).pop()}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              {heroData?.linkedinUrl && heroData.linkedinUrl !== '#' && (
                <Link href={heroData.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center p-1.5 rounded-none border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-in-out">
                    <div className="overflow-hidden flex items-center">
                      <span className="whitespace-nowrap text-xs font-bold text-foreground pl-3 pr-2">
                        {heroData.linkedinUrl.split('/').filter(Boolean).pop()}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              {heroData?.twitterUrl && heroData.twitterUrl !== '#' && (
                <Link href={heroData.twitterUrl} target="_blank" rel="noreferrer" className="inline-flex items-center p-1.5 rounded-none border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <XLogo className="h-5 w-5" />
                  </div>
                  <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-in-out">
                    <div className="overflow-hidden flex items-center">
                      <span className="whitespace-nowrap text-xs font-bold text-foreground pl-3 pr-2">
                        {heroData.twitterUrl.split('/').filter(Boolean).pop()}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              {heroData?.youtubeUrl && heroData.youtubeUrl !== '#' && (
                <Link href={heroData.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center p-1.5 rounded-none border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Youtube className="h-5 w-5" />
                  </div>
                  <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-in-out">
                    <div className="overflow-hidden flex items-center">
                      <span className="whitespace-nowrap text-xs font-bold text-foreground pl-3 pr-2">
                        {heroData.youtubeUrl.split('/').filter(Boolean).pop()}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              </div>
            </div>
          </div>
          <Card className="hover:shadow-2xl border-primary/30 rounded-none bg-background relative overflow-hidden group">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            <CardHeader className="border-b border-primary/20 bg-primary/5 pb-4 px-6 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-mono text-lg uppercase tracking-wider text-primary flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                ~/messaging_sys
              </CardTitle>
              <div className="flex gap-1.5">
                 <div className="w-2 h-2 bg-primary/30"></div>
                 <div className="w-2 h-2 bg-primary/60"></div>
                 <div className="w-2 h-2 bg-primary"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 font-mono">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase text-primary">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" className="bg-background/50 rounded-none border-primary/20 focus-visible:border-primary focus-visible:ring-0" {...field} />
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
                        <FormLabel className="text-xs font-bold uppercase text-primary">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" className="bg-background/50 rounded-none border-primary/20 focus-visible:border-primary focus-visible:ring-0" {...field} />
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
                        <FormLabel className="text-xs font-bold uppercase text-primary">Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your message..." className="min-h-[150px] bg-background/50 rounded-none border-primary/20 focus-visible:border-primary focus-visible:ring-0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-4 rounded-none border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase tracking-[0.2em] transition-all duration-300" size="lg" disabled={isPending}>
                    {isPending ? 'Executing...' : 'Execute ./send'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
