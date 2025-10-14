import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { skills } from '@/lib/data';

export function AboutSection() {
  return (
    <section id="about" className="w-full py-20 lg:py-24 bg-muted/40">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-6">About Me</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
             I am a Software Engineer at Sosuv Consulting, where I debug and refactor complex codebases, improving system reliability. I specialize in designing automated scripts and containerized workflows with Docker to optimize efficiency.
            </p>
            <p>
              I hold a Bachelor of Technology from IIT (ISM) Dhanbad with a major in Civil Engineering and a minor in Computer Science. My technical interests lie in web development, database management, and cloud technologies.
            </p>
            <p>
              When I&apos;m not coding, I enjoy solving problems on platforms like Leetcode and exploring my interests in badminton and Hindi poetry.
            </p>
          </div>
        </div>
        <Card className="shadow-lg order-1 md:order-2">
          <CardHeader>
            <CardTitle className="font-headline">My Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary/50 transition-colors"
                >
                  <skill.icon className="h-6 w-6 text-primary" />
                  <span className="font-medium text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
