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
import { IntroLoader } from '@/components/ui/intro-loader';
import { RouteProgress } from '@/components/ui/route-progress';
import { Suspense } from 'react';

import { getHero, getAbout, getProjects, getBlogs, getEducation, getSkills, getCertifications, getAllPages } from '@/db/queries';

import { SITE_URL, toArticleSummary } from '@/lib/site';
import { toProjectSummary } from '@/lib/projects';
import { JsonLd, personSchema } from '@/components/seo/json-ld';
import { CommandPalette } from '@/components/ui/command-palette';
import { TrackClicks } from '@/components/ui/track-clicks';
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
  alternates: {
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Utkarsh Gupta — Writing' }] },
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
  const [hero, about, projects, blogs, education, skills, certifications, sitePages] = await Promise.all([
    getHero(), getAbout(), getProjects(), getBlogs(), getEducation(), getSkills(), getCertifications(), getAllPages()
  ]);
  // Published free-form pages (/now, /uses) get footer links
  const pageLinks = sitePages.filter((p) => p.status === 'active').map((p) => ({ name: p.title, href: `/${p.slug}` }));

  const terminalData = { hero, about, projects: projects.map(toProjectSummary), blogs: blogs.map(toArticleSummary), education, skills, certifications };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before paint: flag JS (reveal animations hide content up front) and decide whether the
            first-visit intro loader shows (not seen this session, motion allowed, not the admin), and
            apply the theme (saved choice, else the OS setting) so there's no light/dark flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('utkristi-portfolio-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.classList.add(t)}catch(e){}try{var p=location.pathname;if(!sessionStorage.getItem('utkristi-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&p.indexOf('/admin')!==0&&p.indexOf('/login')!==0){d.classList.add('intro-active')}}catch(e){}})()` }} />
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
            <SiteFooter extraLinks={pageLinks} />
            <TerminalUI data={terminalData} />
          </div>
          <JsonLd data={personSchema(hero)} />
          <CommandPalette
            data={{
              projects: terminalData.projects,
              blogs: terminalData.blogs,
              pages: pageLinks,
              resumeUrl: hero?.resumeUrl,
              email: 'utkarshofficial1912@gmail.com',
            }}
          />
          <TrackClicks />
          <Toaster />
          <div className="grain" aria-hidden="true" />
          <PointerEffects />
          <IntroLoader />
          {/* useSearchParams needs a Suspense boundary */}
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
        </ThemeProvider>
        {/* Only load Analytics when an ID is configured */}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
