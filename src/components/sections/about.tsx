import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAbout, getSkills } from '@/db/queries';
import {
  Code, Database, Server, Wind, Briefcase, GitGraph,
  Cpu, Fingerprint, FileCode, GraduationCap, Network,
  Book, Terminal, Cloud, BriefcaseBusiness
} from 'lucide-react';

const iconsMap: any = { Code, Database, Server, Wind, Briefcase, GitGraph, Cpu, Fingerprint, FileCode, GraduationCap, Network, Book, Terminal, Cloud, BriefcaseBusiness };

export async function AboutSection() {
  const about = await getAbout();
  const skills = await getSkills();

  return (
    <section id="about" className="w-full py-20 lg:py-24 bg-muted/40">
      <div className="container grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-6">About Me</h2>
          <div className="space-y-4 text-muted-foreground">
            {about?.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">My Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="Programming" className="w-full">
                {skills.map((category) => {
                  const CatIcon = iconsMap[category.categoryIcon] || Code;
                  return (
                    <AccordionItem key={category.category} value={category.category}>
                      <AccordionTrigger className="font-semibold">
                        <div className="flex items-center gap-3">
                          <CatIcon className="h-5 w-5 text-primary" />
                          {category.category}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          {category.items.map((skill) => {
                            const SkillIcon = iconsMap[skill.icon] || Code;
                            return (
                              <div
                                key={skill.name}
                                className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary/50 transition-colors"
                              >
                                <SkillIcon className="h-5 w-5 text-primary/80" />
                                <span className="font-medium text-sm">{skill.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
