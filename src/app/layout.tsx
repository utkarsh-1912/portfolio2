import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Toaster } from '@/components/ui/toaster';
import { TerminalUI } from '@/components/ui/terminal';
import { GoogleAnalytics } from '@next/third-parties/google';
import { PointerEffects } from '@/components/ui/pointer-effects';

import { getHero, getAbout, getProjects, getBlogs, getEducation, getSkills, getCertifications } from '@/db/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://utkristi.com';
const DESCRIPTION =
  'Utkarsh Gupta is a software engineer working on electronic trading systems, backend systems and agentic AI. Projects, writing and contact.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Utkarsh Gupta — Software Engineer',
    template: '%s — Utkarsh Gupta',
  },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Utkristi',
    title: 'Utkarsh Gupta — Software Engineer',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utkarsh Gupta — Software Engineer',
    description: DESCRIPTION,
    creator: '@Utkarsh191201',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0c0b' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hero, about, projects, blogs, education, skills, certifications] = await Promise.all([
    getHero(), getAbout(), getProjects(), getBlogs(), getEducation(), getSkills(), getCertifications()
  ]);

  const terminalData = { hero, about, projects, blogs, education, skills, certifications };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Flags JS as available before paint so reveal animations can hide content up front */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body text-foreground antialiased')}
        suppressHydrationWarning={true}
      >
        <ThemeProvider storageKey="utkristi-portfolio-theme">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
          >
            Skip to content
          </a>
          <div className="relative flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">{children}</main>
            <SiteFooter />
            <TerminalUI data={terminalData} />
          </div>
          <Toaster />
          <div className="grain" aria-hidden="true" />
          <PointerEffects />
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'} />
      </body>
    </html>
  );
}
