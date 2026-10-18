'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SectionHeading } from '@/components/ui/section-heading';
import { RollText } from '@/components/ui/roll-text';
import { trackEvent } from '@/lib/analytics';
import { getSocialLinks } from '@/components/ui/social-links';
import { handleFormSubmission } from '@/lib/actions';
import { formSchema } from '@/lib/schemas';

const EMAIL = 'utkarshofficial1912@gmail.com';
const PHONE_DISPLAY = '(+91) 639-494-8921';
const PHONE_HREF = 'tel:+916394948921';

// Underlined, borderless fields to match the editorial layout
const fieldClass =
  'h-12 rounded-none border-0 border-b border-input bg-transparent px-0 text-base shadow-none focus-visible:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0';

export function ContactSection({ heroData }: { heroData?: any }) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      website: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await handleFormSubmission(values);
      if (result.success) {
        trackEvent('contact_submit');
        toast({
          title: 'Message sent',
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: 'Something went wrong',
          description: result.message || 'Please try again.',
          variant: 'destructive',
        });
      }
    });
  }

  const socials = getSocialLinks(heroData);
  const [copied, setCopied] = React.useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      trackEvent('copy_email', { source: 'contact' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: EMAIL });
    }
  };

  return (
    <section id="contact" className="relative w-full border-t border-border py-24 md:py-36">
      <div className="container">
        <SectionHeading index="06" label="Contact" title="Let's build something" />

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Direct contact */}
          <div className="lg:col-span-6">
            <p data-reveal="up" className="eyebrow">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              data-reveal="up"
              className="group mt-3 inline-flex max-w-full items-center gap-2 break-all font-headline text-2xl font-semibold tracking-tight transition-colors hover:text-primary sm:text-3xl xl:text-4xl"
            >
              <span className="link-draw">{EMAIL}</span>
              <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <div data-reveal="up" className="mt-4">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy email'}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? 'Email copied to clipboard' : ''}</span>
            </div>

            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              <div data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}>
                <dt className="eyebrow">Phone</dt>
                <dd className="mt-2">
                  <a href={PHONE_HREF} className="link-draw text-lg">{PHONE_DISPLAY}</a>
                </dd>
              </div>
              {socials.length > 0 && (
                <div data-reveal="up" style={{ '--i': 2 } as React.CSSProperties}>
                  <dt className="eyebrow">Elsewhere</dt>
                  <dd className="mt-2 flex flex-col gap-1.5">
                    {socials.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-lg">
                        <span className="link-draw">{s.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Form */}
          <div data-reveal="up" style={{ '--i': 1 } as React.CSSProperties} className="lg:col-span-6">
            <div data-spotlight className="rounded-3xl border border-border bg-card p-6 sm:p-10">
              <p className="eyebrow">Or send a message</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
                  {/* Honeypot: off-screen and skipped by keyboard and screen readers; bots tend to fill it */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label>
                      Website
                      <input type="text" tabIndex={-1} autoComplete="off" {...form.register('website')} />
                    </label>
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">Name</FormLabel>
                          <FormControl>
                            <Input autoComplete="name" className={fieldClass} {...field} />
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
                          <FormLabel className="text-sm text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input type="email" autoComplete="email" className={fieldClass} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Tell me a little about your project…"
                            className={`${fieldClass} h-auto min-h-[140px] resize-none py-3`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    data-magnetic
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-base font-medium text-background transition-opacity disabled:opacity-50"
                  >
                    <RollText>{isPending ? 'Sending…' : 'Send message'}</RollText>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
