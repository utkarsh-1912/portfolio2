import { getEducation } from '@/db/queries';
import { Briefcase, GraduationCap } from 'lucide-react';

const iconsMapping: any = {
  Briefcase,
  GraduationCap
};

export async function EducationSection() {
  const education = await getEducation();
  return (
    <section id="education" className="w-full min-h-screen py-10 md:py-16 lg:py-24 bg-muted/20 relative border-t border-border/50 snap-start flex flex-col justify-center overflow-y-auto">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl mb-12 font-mono uppercase text-foreground">&gt; git log --oneline --graph</h2>
        <div className="relative">
          {/* Glowing center line */}
          <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
          {education.map((item, index) => {
            const IconComp = iconsMapping[item.icon] || Briefcase;
            return (
              <div key={item.id} className="relative flex items-start w-full mb-12">
                {/* Left side (Desktop only, Evens) */}
                <div className="hidden sm:block w-1/2 pr-8">
                  {index % 2 === 0 && (
                      <div className="bg-card/80 backdrop-blur border border-primary/20 p-6 rounded-none group hover:-translate-y-1 transition-all duration-300 font-mono relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                        <div className="text-[10px] font-bold text-primary/70 mb-2 uppercase tracking-[0.2em]">Commit: {item.duration}</div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.degree}</h3>
                        <p className="font-semibold text-foreground/80 mt-1">{item.institution}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-4 border-l-2 border-primary/30 pl-4 py-1">{item.description}</p>
                      </div>
                  )}
                </div>

                {/* Center Node */}
                <div className="absolute left-4 top-0 sm:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 bg-background rounded-full border-2 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                  <IconComp className="h-4 w-4 text-primary" />
                </div>

                {/* Right side (Desktop Odds, Mobile ALL) */}
                <div className="w-full sm:w-1/2 pl-12 sm:pl-8">
                  <div className={index % 2 === 0 ? "sm:hidden" : ""}>
                      <div className="bg-card/80 backdrop-blur border border-primary/20 p-6 rounded-none group hover:-translate-y-1 transition-all duration-300 font-mono relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                        <div className="text-[10px] font-bold text-primary/70 mb-2 uppercase tracking-[0.2em]">Commit: {item.duration}</div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.degree}</h3>
                        <p className="font-semibold text-foreground/80 mt-1">{item.institution}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-4 border-l-2 border-primary/30 pl-4 py-1">{item.description}</p>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
