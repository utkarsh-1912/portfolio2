import { education } from '@/lib/data';

export function EducationSection() {
  return (
    <section id="education" className="w-full py-20 lg:py-24">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-headline tracking-tighter text-center sm:text-4xl mb-12">Experience & Education</h2>
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
          {education.map((item, index) => (
            <div key={item.degree} className="relative flex items-start w-full mb-12">
              <div className="hidden sm:block w-1/2 pr-8 text-right">
                {index % 2 === 0 && (
                  <div>
                    <h3 className="text-lg font-bold font-headline">{item.degree}</h3>
                    <p className="font-semibold text-primary">{item.institution}</p>
                    <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                )}
              </div>
              
              <div className="absolute left-4 top-0 sm:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 bg-background rounded-full border-2 border-primary">
                {item.icon && <item.icon className="h-4 w-4 text-primary" />}
              </div>

              <div className="w-full sm:w-1/2 pl-12 sm:pl-8">
                {index % 2 !== 0 && (
                   <div className="sm:hidden">
                    <h3 className="text-lg font-bold font-headline">{item.degree}</h3>
                    <p className="font-semibold text-primary">{item.institution}</p>
                    <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                )}
                 <div className="hidden sm:block">
                  {index % 2 !== 0 && (
                    <div>
                      <h3 className="text-lg font-bold font-headline">{item.degree}</h3>
                      <p className="font-semibold text-primary">{item.institution}</p>
                      <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  )}
                 </div>
                 <div className="sm:hidden">
                  {index % 2 === 0 && (
                      <div>
                        <h3 className="text-lg font-bold font-headline">{item.degree}</h3>
                        <p className="font-semibold text-primary">{item.institution}</p>
                        <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
