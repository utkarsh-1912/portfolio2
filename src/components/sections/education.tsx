import { education } from '@/lib/data';

export function EducationSection() {
  return (
    <section id="education" className="w-full py-20 lg:py-24">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-headline tracking-tighter text-center sm:text-4xl mb-12">Experience & Education</h2>
        <div className="relative">
          <div className="absolute left-3.5 sm:left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
          {education.map((item, index) => (
            <div key={item.degree} className="relative flex items-start sm:items-center w-full mb-12">
              <div
                className={`w-full sm:w-[calc(50%_-_2rem)] pl-10 sm:pl-0 ${
                  index % 2 === 0 ? 'sm:text-right' : 'sm:order-2 sm:text-left'
                } `}
              >
                <h3 className="text-lg font-bold font-headline">{item.degree}</h3>
                <p className="font-semibold text-primary">{item.institution}</p>
                <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>

              <div className="absolute left-3.5 sm:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-background rounded-full border-2 border-primary">
                {item.icon && <item.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />}
              </div>

              <div className="hidden sm:block w-[calc(50%_-_2rem)]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
