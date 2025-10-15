import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with 💙 by{' '}
          <a
            href="https://github.com/utkarsh-1912"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Utkarsh Gupta
          </a>
          .
        </p>
        <div className="flex items-center space-x-1">
          <Button asChild variant="ghost" size="icon">
            <Link href="https://github.com/utkarsh-1912" target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="https://www.linkedin.com/in/utkarsh-gupta-3a374119a/" target="_blank" rel="noreferrer">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="https://x.com/Utkarsh191201" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="sr-only">X</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
