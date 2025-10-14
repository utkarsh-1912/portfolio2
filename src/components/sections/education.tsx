import { education } from '@/lib/data';
import { GraduationCap } from 'lucide-react';

export function EducationSection() {
  return (
    <section id="education" className="w-full py-24 sm:py-32">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-headline tracking-tighter text-center sm:text-4xl mb-12">My Education</h2>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
          {education.map((item, index) => (
            <div key={item.degree} className="relative flex items-center justify-between w-full mb-12">
              <div
                className={`w-[calc(50%_-_2rem)] ${
                  index % 2 === 0 ? 'text-right' : 'order-2 text-left'
                } `}
              >
                <h3 className="text-lg font-bold font-headline">{item.degree}</h3>
                <p className="font-semibold text-primary">{item.institution}</p>
                <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 bg-background rounded-full border-2 border-primary">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>

              <div className="w-[calc(50%_-_2rem)]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
