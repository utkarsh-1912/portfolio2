import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { skills } from '@/lib/data';

export function AboutSection() {
  return (
    <section id="about" className="w-full py-24 sm:py-32 bg-muted/40">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-6">About Me</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              I am a final year Computer Science and Engineering student at IIT Kanpur, with a passion for competitive
              programming and full-stack development. I enjoy building scalable and efficient software solutions.
            </p>
            <p>
              My goal is to create high-quality products with pixel-perfect, performant experiences. I have a keen eye
              for detail and a dedication to crafting user-friendly interfaces.
            </p>
            <p>
              When I&apos;m not coding, I enjoy solving problems on platforms like LeetCode and Codeforces, exploring
              new technologies, and contributing to open-source projects.
            </p>
          </div>
        </div>
        <Card className="shadow-lg">
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
                  <span className="font-medium">{skill.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
