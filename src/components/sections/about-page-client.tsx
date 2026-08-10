'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Code, Database, Server, Wind, Briefcase, GitGraph,
  Cpu, Fingerprint, FileCode, GraduationCap, Network,
  Book, Terminal, Cloud, BriefcaseBusiness, Trophy, Activity, Github, Users, Link as LinkIcon
} from 'lucide-react';
import type { CodeforcesUser, LeetCodeStats, GitHubUserStats } from '@/lib/api-stats';
import Link from 'next/link';
import { XLogo } from '@/components/ui/x-logo'; // if needed

const iconsMap: any = { Code, Database, Server, Wind, Briefcase, GitGraph, Cpu, Fingerprint, FileCode, GraduationCap, Network, Book, Terminal, Cloud, BriefcaseBusiness };

type StatsProps = {
  cfStats: CodeforcesUser | null;
  lcStats: LeetCodeStats | null;
  ghStats: GitHubUserStats | null;
};

export function AboutPageClient({ about, skills, stats }: { about: any, skills: any[], stats: StatsProps }) {
  return (
    <section className="w-full py-10 md:py-16 lg:py-24 bg-background relative min-h-screen">
      <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none"></div>

      <div className="container relative z-10">
        <div className="mb-14 font-mono">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1 border border-primary/30 rounded-none">./about</span>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl uppercase text-foreground">&gt; whoami --verbose</h1>
            <p className="mt-4 text-muted-foreground">A deeper dive into my background, skills, and coding activity.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          {/* Left Column: Bio & Stats */}
          <div className="xl:col-span-2 space-y-12">
            
            {/* Bio */}
            <div className="font-mono space-y-4 text-muted-foreground leading-relaxed text-lg">
              {about?.paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Live Coding Stats Terminal */}
            <Card className="tech-border rounded-none bg-card/80 backdrop-blur">
                <CardHeader className="border-b border-primary/20 bg-muted/50 pb-4">
                  <CardTitle className="font-mono text-xl uppercase tracking-wider text-primary flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    ./live_stats.sh
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 font-mono grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* GitHub Stats */}
                  <div className="p-4 border border-border bg-background/50 flex flex-col gap-2 relative group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
                      <Github className="h-4 w-4" /> GitHub
                    </div>
                    {stats.ghStats ? (
                        <>
                            <div className="text-2xl font-bold text-foreground">{stats.ghStats.public_repos} <span className="text-sm font-normal text-muted-foreground">repos</span></div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {stats.ghStats.followers} followers</span>
                            </div>
                            <Link href={stats.ghStats.html_url} target="_blank" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <LinkIcon className="h-4 w-4 text-primary" />
                            </Link>
                        </>
                    ) : (
                        <div className="text-xs text-muted-foreground">Failed to fetch.</div>
                    )}
                  </div>

                  {/* LeetCode Stats */}
                  <div className="p-4 border border-border bg-background/50 flex flex-col gap-2 relative group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
                      <Code className="h-4 w-4" /> LeetCode
                    </div>
                    {stats.lcStats && stats.lcStats.status === "success" ? (
                        <>
                            <div className="text-2xl font-bold text-foreground">{stats.lcStats.totalSolved} <span className="text-sm font-normal text-muted-foreground">solved</span></div>
                            <div className="flex items-center gap-3 text-xs mt-2">
                                <span className="text-green-500 font-bold">{stats.lcStats.easySolved} E</span>
                                <span className="text-yellow-500 font-bold">{stats.lcStats.mediumSolved} M</span>
                                <span className="text-red-500 font-bold">{stats.lcStats.hardSolved} H</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-xs text-muted-foreground">Failed to fetch.</div>
                    )}
                  </div>

                  {/* Codeforces Stats */}
                  <div className="p-4 border border-border bg-background/50 flex flex-col gap-2 relative group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
                      <Trophy className="h-4 w-4" /> Codeforces
                    </div>
                    {stats.cfStats ? (
                        <>
                            <div className="text-2xl font-bold text-foreground">{stats.cfStats.rating || 'N/A'} <span className="text-sm font-normal text-muted-foreground">rating</span></div>
                            <div className="text-xs text-muted-foreground mt-2 capitalize">
                                Max: <span className="font-bold text-primary">{stats.cfStats.maxRank} ({stats.cfStats.maxRating})</span>
                            </div>
                            <Link href={`https://codeforces.com/profile/${stats.cfStats.handle}`} target="_blank" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <LinkIcon className="h-4 w-4 text-primary" />
                            </Link>
                        </>
                    ) : (
                        <div className="text-xs text-muted-foreground">Failed to fetch.</div>
                    )}
                  </div>

                </CardContent>
            </Card>

          </div>

          {/* Right Column: Skills */}
          <div className="xl:col-span-1">
            <Card className="tech-border rounded-none bg-card/80 backdrop-blur sticky top-24">
              <CardHeader className="border-b border-primary/20 bg-muted/50 pb-4">
                <CardTitle className="font-mono text-xl uppercase tracking-wider text-primary flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  ./skills.json
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 font-mono">
                <Accordion type="single" collapsible defaultValue="Programming" className="w-full">
                  {skills.map((category) => {
                    const CatIcon = iconsMap[category.categoryIcon] || Code;
                    return (
                      <AccordionItem key={category.category} value={category.category} className="border-primary/20">
                        <AccordionTrigger className="font-bold hover:text-primary hover:no-underline uppercase tracking-wider text-sm">
                          <div className="flex items-center gap-3">
                            <CatIcon className="h-5 w-5 text-primary" />
                            {category.category}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 gap-2 pt-4 pb-2">
                            {category.items.map((skill: any) => {
                              const SkillIcon = iconsMap[skill.icon] || Code;
                              return (
                                <div
                                  key={skill.name}
                                  className="flex items-center gap-3 p-2 rounded-none border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                  <SkillIcon className="h-4 w-4 text-primary" />
                                  <span className="font-bold text-xs uppercase text-foreground/80">{skill.name}</span>
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
      </div>
    </section>
  );
}
