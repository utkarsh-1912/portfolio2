import { getAbout } from '@/db/queries';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function AboutSection() {
  const about = await getAbout();

  return (
    <section id="about" className="w-full min-h-screen py-20 bg-background relative border-t border-border/50 snap-start flex flex-col justify-center">
      <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none"></div>

      <div className="container relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto h-full">
        <div className="text-center font-mono mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1 border border-primary/30 rounded-none">./about</span>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl uppercase text-foreground">&gt; whoami</h2>
        </div>

        <div className="w-full text-left bg-card/80 backdrop-blur border border-primary/20 p-6 md:p-10 font-mono mb-10 tech-border relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="flex items-center gap-2 mb-6 border-b border-primary/20 pb-4">
            <div className="w-2.5 h-2.5 bg-primary/40"></div>
            <div className="w-2.5 h-2.5 bg-primary/60"></div>
            <div className="w-2.5 h-2.5 bg-primary"></div>
          </div>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
            <span className="text-primary font-bold mr-2">root@system:~$</span> <span className="text-foreground">cat summary.txt</span>
            <br/><br/>
            {about?.paragraphs[0]}
            <span className="animate-blink text-primary inline-block ml-1">_</span>
          </p>
        </div>
        
        <Link href="/about">
          <Button variant="outline" className="tech-border rounded-none bg-primary/5 hover:bg-primary hover:text-primary-foreground font-mono px-8 py-6 uppercase tracking-widest transition-colors duration-300">
             <Terminal className="h-5 w-5 mr-3" /> cd ./about --verbose
          </Button>
        </Link>
      </div>
    </section>
  );
}
