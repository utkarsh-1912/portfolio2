import { ExchangeTimeline } from './exchange-timeline';
import { ExchangeTicker } from './exchange-ticker';
import { ArrowUpRight, ArrowRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import profileImage from '@/app/profile.jpg';
import { getHero, getProjects, getEducation, getBlogs, getSkills, getAbout } from '@/db/queries';
import { hasCaseStudy } from '@/lib/projects';
import { articleHref } from '@/lib/site';
import { skipOptimization } from '@/lib/images';
import { MarketDemo } from './market-demo';

export async function ExchangeHome() {
  const [hero, projects, education, blogs, skills, about] = await Promise.all([getHero(), getProjects(), getEducation(), getBlogs(), getSkills(), getAbout()]);
  return <div className="exchange-only exchange-home">
    <ExchangeTicker />
    <div className="exchange-home-grid">
      <section className="exchange-intro">
        <div className="exchange-kicker"><span className="exchange-dot"/> ENGINEER / BENGALURU <span>12.97° N / 77.59° E</span></div>
        <p className="exchange-greeting" lang="kn">ನಮಸ್ಕಾರ<span aria-hidden="true">.</span></p>
        <h1>{hero?.title || 'Utkarsh Gupta'}<span>Electronic trading.<br/> <em>Systems engineering.</em></span></h1>
        <p className="exchange-description">{hero?.description || 'Building electronic trading systems, dependable backends, and thoughtful software.'}</p>
        <div className="exchange-actions"><Link href="/about">Profile <ArrowRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link><Link href="/projects">Explore projects <span><ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></span></Link></div>
        <div className="exchange-profile"><Image src={hero?.photoUrl || profileImage} alt="" width={44} height={44} unoptimized={skipOptimization(hero?.photoUrl)} /><div><strong>Utkarsh Gupta</strong><span>SOFTWARE ENGINEER / FIX SYSTEMS</span></div>{hero?.resumeUrl && <a href={hero.resumeUrl} target="_blank" rel="noreferrer">Résumé <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></a>}</div>
      </section>
      <MarketDemo />
    </div>
    <section className="exchange-section"><div className="exchange-section-heading"><div><span className="exchange-kicker">SELECTED WORK / ಕೆಲಸ</span><h2>Selected builds<span>.</span></h2></div><Link href="/projects">All projects <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link></div><div className="exchange-project-list">{projects.slice(0, 4).map((project, i) => <article key={project.id}><span className="exchange-project-number">0{i+1}</span><div><h3><Link href={hasCaseStudy(project) && project.slug ? `/projects/${project.slug}` : '/projects'}>{project.title} <span><ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></span></Link></h3><p>{project.description}</p><div className="exchange-tags">{project.tags.slice(0,5).map(tag => <span key={tag}>{tag}</span>)}</div></div><span className="exchange-project-kind">{project.featured ? 'FEATURED' : 'PROJECT'}</span></article>)}{projects.length === 0 && <p>Project listings are temporarily unavailable. <Link href="/projects">Explore the project archive <ArrowRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link></p>}</div></section>
    <div className="exchange-bottom-grid"><section className="exchange-section"><div className="exchange-section-heading"><div><span className="exchange-kicker">BACKGROUND / ನನ್ನ ಬಗ್ಗೆ</span><h2>Behind the systems<span>.</span></h2></div></div><p className="exchange-bio">{about?.paragraphs?.[0] || 'Explore my background, experience, and the tools behind my work.'}</p><Link className="exchange-text-link" href="/about">Meet the engineer <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link><div className="exchange-skills">{skills.slice(0,5).map(group => <div key={group.id}><small>{group.category}</small><p>{group.items.map(item => item.name).join(' / ')}</p></div>)}</div></section><section id="exchange-experience" className="exchange-section"><div className="exchange-section-heading"><div><span className="exchange-kicker">EXPERIENCE / JOURNAL</span><h2>Experience<span>.</span></h2></div></div><ExchangeTimeline items={education} /><Link className="exchange-text-link" href="/about">Full background <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link></section></div>
    <section className="exchange-section"><div className="exchange-section-heading"><div><span className="exchange-kicker">RESEARCH NOTES / ಬರಹ</span><h2>From the notebook<span>.</span></h2></div><Link href="/blog">All writing <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link></div><div className="exchange-writing">{blogs.slice(0,3).map((post, i) => <a key={post.id} href={articleHref(post)}><small>NOTE / 0{i+1}</small><h3>{post.title}</h3><p>{post.description}</p><span>Read note <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></span></a>)}{blogs.length === 0 && <Link href="/blog">Visit the writing archive <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link>}</div></section>
    <div className="exchange-signoff"><span lang="kn">ಮತ್ತೆ ಸಿಗೋಣ.</span><p>Good systems start with a conversation.</p><a href="#contact">LET’S BUILD SOMETHING <ArrowDownRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></a></div>
  </div>;
}
